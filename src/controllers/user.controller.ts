import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import _ from "lodash";
import { customAlphabet } from "nanoid";
import HTTP from "http-status-codes";

import UserService from "../services/user.service";

import { USER_RESPONSE } from "../constants/response.constant";
import { IUser, IResponse, IRequest, INextFunction } from "../helpers/interface.helper";
import { otpGenerator } from "../helpers/functions.helper";
import Mail from "../helpers/mail.helper";
import { EMAIL_TEMPLATES } from "../constants/email.constant";
import { ROLE } from "../constants/user.constant";

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
        req.body.role = ROLE.USER;
        // Store hash in your password DB.
        await UserService.createUser(req.body);
        res.send({ status: USER_RESPONSE.SUCCESS, message: USER_RESPONSE.USER_CREATED });
        // await UserService.sendConfirmationMail(email);
      } else if (user && user.is_deleted) {
        let hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
        req.body.email = email;
        req.body.is_deleted = false;
        // Store hash in your password DB.
        let query = { _id: user._id };
        const updated = await UserService.updateUser(query, req.body);
        if (updated) {
          // let confirmation = await UserService.sendConfirmationMail(email);
          // if (!confirmation) {
          //   res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.CONFIRMATION_EMAIL_FAILED });
          // }
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
  socialSignIn: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      let email = req.body.email.trim().toLowerCase();
      let user: IUser = await UserService.userDetails(undefined, email);
      const salt = parseInt(process.env.SALT, 10);
      if (!user) {
        let password = nanoid(10);
        let hash = await bcrypt.hash(password, salt);
        req.body.password = hash;
        req.body.email = email;
        req.body.role = ROLE.USER;
        req.body.email_verified = true;
        // Store hash in your password DB.
        let user: any = await UserService.createUser(req.body);
        let token = await UserService.generateToken(user._id, user.email, user.role);
        delete user.password;
        res.send({ status: USER_RESPONSE.SUCCESS, message: USER_RESPONSE.USER_CREATED, token, role: user.role, data: user });
      } else if (user) {
        req.body.email = email;
        req.body.is_deleted = false;
        // Store hash in your password DB.
        let query = { _id: user._id };
        const updated = await UserService.updateUser(query, req.body);
        if (updated) {
          let token = await UserService.generateToken(user._id, user.email, user.role);
          delete user.password;
          res.send({ status: USER_RESPONSE.SUCCESS, message: USER_RESPONSE.USER_EXIST, token, role: user.role, data: user });
          // let confirmation = await UserService.sendConfirmationMail(email);
          // if (!confirmation) {
          //   res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.CONFIRMATION_EMAIL_FAILED });
          // }
        } else {
          res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.SIGNUP_FAILED });
        }
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
          let token = await UserService.generateToken(user._id, user.email, user.role);
          delete user.password;
          res.send({ status: USER_RESPONSE.SUCCESS, message: USER_RESPONSE.USER_EXIST, token, role: user.role, data: user });
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
  editPassword: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      let email = req.body.email.trim().toLowerCase();
      let user: IUser = await UserService.userDetails(undefined, email);
      const salt = parseInt(process.env.SALT, 10);
      if (user) {
        let hash = await bcrypt.hash(req.body.password, salt);
        let query: any = {
          password: hash,
        };
        let updated = await UserService.updateUser({ _id: user._id }, query);
        if (!updated) {
          throw new Error(USER_RESPONSE.FAILED_TO_EDIT_USER);
        } else {
          res.send({ status: USER_RESPONSE.SUCCESS, message: USER_RESPONSE.PASSWORD_CHANGED, data: user });
        }
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.USER_DOESNT_EXIST });
      }
    } catch (err) {
      err.desc = USER_RESPONSE.FAILED_TO_CHANGE_PASSWORD;
      next(err);
    }
  },
  sendOtp: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      let email = req.body.email.trim().toLowerCase();
      let user: IUser = await UserService.userDetailsWithPassword(undefined, email);
      if (user) {
        let otp: any = otpGenerator();
        let subject = "otp verfication";
        let text = `Hi ${user.username}`;
        let html = EMAIL_TEMPLATES.sendOtp(user.username, otp);
        Mail("", email, subject, text, html);
        let query: any = {
          otp,
          otp_verify: true,
        };
        let updated = await UserService.updateUser({ _id: user._id }, query);
        if (updated) {
          let user: IUser = await UserService.userDetailsWithPassword(undefined, email);
          delete user.password;
          res.send({ status: USER_RESPONSE.SUCCESS, message: USER_RESPONSE.SEND_OTP, data: user });
        }
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.USER_DOESNT_EXIST });
      }
    } catch (err) {
      err.desc = USER_RESPONSE.SEND_OTP_FAILED;
      next(err);
    }
  },
  verifyOtp: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      let email = req.body.email.trim().toLowerCase();
      let user: IUser = await UserService.userDetailsWithPassword(undefined, email);
      if (user) {
        if (user.otp === req.body.otp && user.otp_verify) {
          let query: any = {
            otp_verify: false,
          };
          await UserService.updateUser({ _id: user._id }, query);
          res.send({ status: USER_RESPONSE.SUCCESS, message: USER_RESPONSE.VERIFY_OTP });
        }
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.VERIFY_OTP_FAILED });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: USER_RESPONSE.FAILED, message: USER_RESPONSE.USER_DOESNT_EXIST });
      }
    } catch (err) {
      err.desc = USER_RESPONSE.VERIFY_OTP_FAILED;
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
  addAddress: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      let query = {
        _id: req.decoded.id,
      };
      let updated = await UserService.updateUser(query, req.body);
      if (!updated) {
        throw new Error(USER_RESPONSE.FAILED_TO_EDIT_USER);
      }
      let getUser = await UserService.userDetails(req.decoded.id);
      res.send({ status: USER_RESPONSE.SUCCESS, message: USER_RESPONSE.ADD_ADDRESS_SUCCESS, data: getUser });
    } catch (err) {
      err.desc = USER_RESPONSE.ADD_ADDRESS_FAILED;
      next(err);
    }
  },

  // logout: async (req: IRequest, res: IResponse, next: INextFunction) => {
  //   try {

  //     res.send({ status: USER_RESPONSE.SUCCESS, message: USER_RESPONSE.USER_LOGGED_OUT });
  //   } catch (err) {
  //     err.desc = USER_RESPONSE.LOGOUT_FAILED;
  //     next(err);
  //   }
  // },
};

export default userController;
