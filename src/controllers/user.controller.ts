import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import _ from "lodash";
import moment from "moment";
import { customAlphabet } from "nanoid";
import HTTP from "http-status-codes";

import USER from "../constants/user.constant";
import UserService from "../services/user.service";
import crypto from "../helpers/crypto.helper";
import Mail from "../helpers/ses.helper";

import { USER_RESPONSE } from "../constants/response.constant";
import { IUser, ISession, IResponse, IRequest, INextFunction } from "../helpers/interface.helper";
import { EMAIL_TEMPLATES } from "../constants/email.constant";

const numbers = "0123456789";
const nanoid = customAlphabet(numbers, 6);

const userController = {
  test: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const test = await UserService.test();
      res.send({ status: USER_RESPONSE.SUCCESS, message: "Test route success", data: test });
    } catch (err) {
      console.log(err);
      err.desc = "Test Route failed";
      next(err);
    }
  },

  verifyToken: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      var token: string = req.headers["authorization"];

      if (!token) return res.status(HTTP.UNAUTHORIZED).send({ auth: false, message: USER_RESPONSE.NO_TOKEN_PROVIDED });

      if (!token.includes("Bearer ")) return res.status(403).send({ auth: false, message: USER_RESPONSE.INVALID_TOKEN });

      token = token.replace("Bearer ", "");
      let decoded = await jwt.verify(token, process.env.SECRET);
      if (decoded) {
        decoded = decoded.data;
        let user: IUser = await UserService.userDetails(decoded.id, undefined);
        if (user) {
          req.decoded = decoded;
          next();
        } else {
          return res.status(HTTP.UNAUTHORIZED).send({ auth: false, message: USER_RESPONSE.TOKEN_ERROR });
        }
      } else {
        return res.status(HTTP.UNAUTHORIZED).send({ auth: false, message: USER_RESPONSE.TOKEN_USER_DOESNT_EXIST });
      }
    } catch (err) {
      err.desc = USER_RESPONSE.INVALID_TOKEN;
      next(err);
    }
  },

  userSignup: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      let email = req.body.email.trim().toLowerCase();
      let user: IUser = await UserService.userDetails(undefined, email);
      const salt = parseInt(process.env.SALT, 10);
      if (!user) {
        let hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
        req.body.email = email;
        // Store hash in your password DB.
        await UserService.createUser(req.body);
        res.send({ status: USER_RESPONSE.SUCCESS, message: USER_RESPONSE.USER_CREATED });
        await UserService.sendConfirmationMail(email);
      } else if (user && user.is_deleted) {
        let hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
        req.body.email = email;
        req.body.is_deleted = false;
        // Store hash in your password DB.
        let query = { _id: user._id };
        const updated = await UserService.updateUser(query, req.body);
        if (updated) {
          let confirmation = await UserService.sendConfirmationMail(email);
          if (!confirmation) {
            res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.CONFIRMATION_EMAIL_FAILED });
          }
          res.send({ status: USER_RESPONSE.SUCCESS, message: USER_RESPONSE.USER_CREATED });
        } else {
          res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.SIGNUP_FAILED });
        }
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.EMAIL_ALREADY_EXIST });
      }
    } catch (error) {
      error.desc = USER_RESPONSE.SIGNUP_FAILED;
      next(error);
    }
  },

  userLogin: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      let email = req.body.email.trim().toLowerCase();
      let user: IUser = await UserService.userDetailsWithPassword(undefined, email);
      if (user) {
        let isTrue = await bcrypt.compare(req.body.password, user.password);
        if (isTrue) {
          let token = await UserService.generateToken(user._id, user.email, user.user_type);
          delete user.password;
          res.send({ status: USER_RESPONSE.SUCCESS, message: USER_RESPONSE.USER_EXIST, token, role: user.user_type, data: user });
          await UserService.createSession({ user: user._id });
        } else {
          res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.INCORRECT_PASSWORD });
        }
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.USER_DOESNT_EXIST });
      }
    } catch (err) {
      err.desc = USER_RESPONSE.LOGIN_FAILED;
      next(err);
    }
  },

  //Social Login
  userSocialLogin: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      let email = req.body.email.trim().toLowerCase();
      let user: IUser = await UserService.userDetails(undefined, email);
      if (user && !user.is_deleted) {
        let token = await UserService.generateToken(user._id, user.email, user.user_type);
        res.send({ status: USER_RESPONSE.SUCCESS, message: USER_RESPONSE.USER_EXIST, token, role: user.user_type, data: user });

        await UserService.createSession({ user: user._id });
      } else if (user && user.is_deleted) {
        req.body.user_type = USER.SOCIAL;
        req.body.email = email;
        req.body.social_account_type = req.body.social_account_type;
        req.body.confirmed = true;
        req.body.is_deleted = false;
        await UserService.updateUser({ _id: user._id }, req.body);
        let user_details = await UserService.userDetails(undefined, email);
        let token = await UserService.generateToken(user_details._id, user_details.email, user_details.user_type);
        res.send({ status: USER_RESPONSE.SUCCESS, message: USER_RESPONSE.USER_CREATED, token, role: user_details.user_type, data: user_details });

        await UserService.createSession({ user: user._id });
      } else {
        req.body.user_type = USER.SOCIAL;
        req.body.social_account_type = req.body.social_account_type;
        req.body.email = email;
        req.body.confirmed = true;
        let user: IUser = await UserService.createUser(req.body);
        let token = await UserService.generateToken(user._id, user.email, user.user_type);
        res.send({ status: USER_RESPONSE.SUCCESS, message: USER_RESPONSE.USER_CREATED, token, role: user.user_type, data: user });

        await UserService.createSession({ user: user._id });
      }
    } catch (err) {
      err.desc = USER_RESPONSE.LOGIN_FAILED;
      next(err);
    }
  },

  //Resend Confirm Email
  resendConfirmationMail: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      let user: IUser = await UserService.userDetails(req.decoded.id, undefined);
      let confirmation = await UserService.sendConfirmationMail(user.email);
      if (confirmation) {
        res.send({ status: USER_RESPONSE.SUCCESS, message: USER_RESPONSE.RESENT_CONFIRMATION });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.CONFIRMATION_EMAIL_FAILED });
      }
    } catch (error) {
      error.desc = USER_RESPONSE.CONFIRMATION_EMAIL_FAILED;
      next(error);
    }
  },

  //Get Confirm Email
  confirmEmail: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      let data: IUser = await UserService.getSingleUserByQuery({ email_confirmation_id: req.body.email_confirmation_id });
      if (data) {
        let query = {
          email_confirmation_id: req.body.email_confirmation_id,
        };
        let update = {
          confirmed: true,
        };
        let updated = await UserService.updateUser(query, update);
        if (updated) {
          res.send({ status: USER_RESPONSE.SUCCESS, message: USER_RESPONSE.EMAIL_CONFIRMED });
        } else {
          res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.FAILED_TO_CONFIRM_EMAIL });
        }
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.EMAIL_NOT_EXIST });
      }
    } catch (err) {
      err.desc = USER_RESPONSE.FAILED_TO_CONFIRM_EMAIL;
      next(err);
    }
  },

  //Forget Password
  forgetPassword: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      let email = req.body.email.trim().toLowerCase();
      let user: IUser = await UserService.userDetails(undefined, email);
      if (user) {
        //Send mail
        var id = new mongoose.Types.ObjectId();
        let html = EMAIL_TEMPLATES.forgotPassword(id);
        const response = await Mail("", email, USER.RESET_PASSWORD, "", html);
        if (response) {
          let query = {
            email: email,
          };
          let update = {
            reset_password_expiry: moment().add(1, "days"),
            reset_password_hash: id,
          };
          let updated = await UserService.updateUser(query, update);
          if (updated) {
            res.send({ status: USER_RESPONSE.SUCCESS, message: USER_RESPONSE.RESET_PASSWORD_SENT });
          } else {
            res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.FAILED_TO_SEND_MAIL });
          }
        } else {
          res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.FAILED_TO_SEND_MAIL });
        }
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.USER_DOESNT_EXIST });
      }
    } catch (err) {
      err.desc = USER_RESPONSE.FAILED_TO_SEND_MAIL;
      next(err);
    }
  },

  resetPassword: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      let user: IUser = await UserService.getSingleUserByQuery({ reset_password_hash: req.body.reset_password_hash });
      const salt = parseInt(process.env.SALT, 10);
      if (user) {
        let hash = await bcrypt.hash(req.body.password, salt);
        let reset_password_hash = new mongoose.Types.ObjectId();
        let update = await UserService.updateUser({ _id: user._id }, { password: hash, reset_password_hash });
        if (update) {
          res.send({ status: USER_RESPONSE.SUCCESS, message: USER_RESPONSE.PASSWORD_CHANGED });
        } else {
          res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.FAILED_TO_RESET_PASSWORD });
        }
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.INCORRECT_PASSWORD });
      }
    } catch (err) {
      err.desc = USER_RESPONSE.FAILED_TO_RESET_PASSWORD;
      next(err);
    }
  },

  changePassword: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      let user: IUser = await UserService.userDetailsWithPassword(req.decoded.id, undefined);
      const salt = parseInt(process.env.SALT, 10);
      if (user && user.password) {
        let response = await bcrypt.compare(req.body.old_password, user.password);
        if (response) {
          let hash = await bcrypt.hash(req.body.password, salt);
          await UserService.updateUser({ _id: req.decoded.id }, { password: hash });
          res.send({ status: USER_RESPONSE.SUCCESS, message: USER_RESPONSE.PASSWORD_CHANGED });
        } else {
          res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.INCORRECT_PASSWORD });
        }
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.INCORRECT_PASSWORD });
      }
    } catch (err) {
      err.desc = USER_RESPONSE.FAILED_TO_CHANGE_PASSWORD;
      next(err);
    }
  },

  sendOtp: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      let email = req.body.email.trim().toLowerCase();
      let user: IUser = await UserService.userDetails(undefined, email);
      if (user) {
        const otp = await nanoid();
        let html = EMAIL_TEMPLATES.sendOtp(user.username, otp);
        let mail = await Mail("", req.body.email, USER.FORGET_PASSWORD, "", html);
        if (mail) {
          let updated = await UserService.updateUser({ _id: user._id }, { otp: otp });
          if (updated) {
            res.send({ status: USER_RESPONSE.SUCCESS, message: USER_RESPONSE.OTP_SENT });
          } else {
            res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.FAILED_TO_SEND_MAIL });
          }
        } else {
          res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.FAILED_TO_SEND_OTP });
        }
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.USER_DOESNT_EXIST });
      }
    } catch (err) {
      err.desc = USER_RESPONSE.FAILED_TO_SEND_OTP;
      next(err);
    }
  },

  verifyOtp: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      let email = req.body.email.trim().toLowerCase();
      const user: IUser = await UserService.getSingleUserByQuery({ email: email, otp: req.body.otp });
      if (user) {
        let id = new mongoose.Types.ObjectId();
        let password_hash = {
          reset_password_expiry: moment().add(1, "days"),
          reset_password_hash: id,
          otp: null,
        };
        let updated = await UserService.updateUser({ _id: user._id }, password_hash);
        if (updated) {
          res.send({ status: USER_RESPONSE.SUCCESS, message: USER_RESPONSE.OTP_VERIFIED, data: { hash: id } });
        } else {
          res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.INVALID_OTP, data: false });
        }
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.INVALID_OTP, data: false });
      }
    } catch (err) {
      err.desc = USER_RESPONSE.FAILED_TO_VERIFY_OTP;
      next(err);
    }
  },

  editUser: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      if (req.body.password || req.body.email) {
        req.body.password = undefined;
        req.body.email = undefined;
      }
      let user: IUser = await UserService.userDetails(req.decoded.id);
      if (user) {
        let query = {
          _id: req.decoded.id,
        };
        let updated = await UserService.updateUser(query, req.body);
        if (!updated) {
          throw new Error(USER_RESPONSE.FAILED_TO_EDIT_USER);
        } else {
          const user = await UserService.userDetails(req.decoded.id);
          res.send({ status: USER_RESPONSE.SUCCESS, message: USER_RESPONSE.USER_MODIFIED, data: user });
        }
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.USER_DOESNT_EXIST });
      }
    } catch (err) {
      err.desc = USER_RESPONSE.FAILED_TO_EDIT_USER;
      next(err);
    }
  },

  viewUser: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      let id = req.params.id ? req.params.id : req.decoded.id;
      let user: IUser = await UserService.userDetails(id);
      if (user) {
        res.send({ status: USER_RESPONSE.SUCCESS, message: USER_RESPONSE.USER_FETCHED, data: user });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.USER_DOESNT_EXIST });
      }
    } catch (err) {
      err.desc = USER_RESPONSE.FAILED_TO_FETCH_USER;
      next(err);
    }
  },

  logout: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const previousSession: ISession = await UserService.findSession(null, req.decoded.id);
      if (previousSession && !previousSession.logout) {
        await UserService.updateSession({ _id: previousSession._id }, { logout: new Date() });
      }

      res.send({ status: USER_RESPONSE.SUCCESS, message: USER_RESPONSE.USER_LOGGED_OUT });
    } catch (err) {
      err.desc = USER_RESPONSE.LOGOUT_FAILED;
      next(err);
    }
  },
};

export default userController;
