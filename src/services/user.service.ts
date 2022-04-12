import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";

import User from "../models/user.model";
import Session from "../models/session.model";

import crypto from "../helpers/crypto.helper";
import Mail from "../helpers/ses.helper";
import { USER_RESPONSE } from "../constants/response.constant";
import { EMAIL, EMAIL_TEMPLATES } from "../constants/email.constant";
import * as s3 from "../helpers/s3.helper";

import { IUser, IUserArray, ISession, ISessionArray, ISessionUpdate, IMongooseUpdate } from "../helpers/interface.helper";
import USER, { USER_HIDDEN_FIELDS } from "../constants/user.constant";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface IToken {
  accessToken?: string;
  idToken?: string;
}

const UserService = {
  test: async () => {
    console.time("test");

    // await UserService.createSession({ user: new mongoose.Types.ObjectId() })
    console.timeEnd("test");
  },

  userDetails: async (id?: string, email?: string): Promise<IUser> => {
    let query: any = {};
    if (id) {
      query._id = id;
    }
    if (email) {
      query.email = email;
    }
    let user = await User.findOne(query, USER_HIDDEN_FIELDS, null).lean();
    return user;
  },

  userDetailsWithPassword: async (id?: string, email?: string) => {
    let query: any = {};
    if (id) {
      query._id = id;
    }
    if (email) {
      query.email = email;
    }
    let user = await User.findOne(query, null, null).lean();
    return user;
  },

  updateUser: async (query: IUser, update: any): Promise<boolean> => {
    let updatedUser: IMongooseUpdate = await User.updateOne(query, update).lean();
    if (updatedUser.n === 0) {
      return false;
    }
    return true;
  },

  getMultipleUsers: async (query: IUser) => {
    let users = await User.find(query, USER_HIDDEN_FIELDS, null).lean();
    return users;
  },

  generateToken: async (id: string, email: string, role: string) => {
    let expiry = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365;
    let token = jwt.sign({ exp: expiry, data: { id: id, email: email, role: role } }, process.env.SECRET);
    token = "Bearer " + token;
    return token;
  },

  sendConfirmationMail: async (email: string) => {
    let user: IUser = await UserService.userDetails(undefined, email);

    //Send mail
    var id = new mongoose.Types.ObjectId();
    let html = await EMAIL_TEMPLATES.confirmEmail(user.first_name, id);
    const response = await Mail("", email, EMAIL.CONFIRM_EMAIL_SUBJECT, "", html);
    if (response) {
      let body = {
        email_confirmation_id: id,
      };
      let update: IMongooseUpdate = await User.updateOne({ email: email }, body);
      if (update.n === 0) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  },

  createUser: async (data: IUser) => {
    const user = await User.create(data);
    return user;
  },

  userList: async (query: any) => {
    let page = query?.page || 1;
    let limit = query?.limit || 20;
    let users: IUserArray = await User.find(query, USER_HIDDEN_FIELDS).skip(page).limit(limit).lean();
    if (query.user_id) {
      let index = await users.findIndex(user => user._id.toString() === query.user_id.toString());
      if (index === -1) {
        let req: any = {
          _id: query.user_id,
        };
        if (query.search && query.search.length > 0) {
          req.username = { $regex: query.search, $options: "i" };
        }
        const user = await User.find(req).lean();
        users = [...users, ...user];
      }
    }
    return users;
  },

  getSingleUserByQuery: async (query: IUser) => {
    const user: IUser = await User.findOne(query, USER_HIDDEN_FIELDS, null).lean();
    return user;
  },

  getUserCount: async (query: IUser) => {
    const count = await User.countDocuments(query).lean();
    return count;
  },

  getUserDetailsWithSession: async (query: IUser) => {
    const user = await User.findOne(query, null, null).lean();
    return user;
  },

  isUsernameExist: async (username: string): Promise<boolean> => {
    let count = await User.countDocuments({ username: username });
    if (count > 0) {
      return false;
    } else {
      return true;
    }
  },

  generateUsername: async (email: string): Promise<string> => {
    let split = email.split("@");
    let username = split[0];
    while (!(await UserService.isUsernameExist(username))) {
      var random = Math.floor(1000 + Math.random() * 9000);
      username = username + random.toString();
    }
    return username;
  },

  authenticateSocialLogin: async (platform: string, token: IToken, payload: any) => {
    if (platform === USER.GOOGLE) {
      let body = await UserService.authenticateGoogle(token);
      return body;
    } else if (platform === USER.FACEBOOK) {
      let body = await UserService.authenticateFB(token, payload);
      return body;
    }
  },

  authenticateGoogle: async (token: IToken) => {
    const ticket = await client.verifyIdToken({
      idToken: token.idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    let data = {
      name: payload.name,
      email: payload.email,
      confirmed: payload.email_verified,
      first_name: payload.given_name,
      last_name: payload.family_name,
      profile_picture: await s3.migrateImageToS3(payload.picture),
      username: await UserService.generateUsername(payload.email),
    };
    return data;
  },

  authenticateFB: async (token: IToken, payload) => {
    let response = await axios.get(`https://graph.facebook.com/${payload.id}?access_token=${token.accessToken}`);
    if (response.data.id === payload.id) {
      let data = {
        name: payload.name,
        email: payload.email,
        confirmed: true,
        first_name: payload.firstName,
        last_name: payload.lastName,
        profile_picture: await s3.migrateImageToS3(payload.profilePicURL),
        username: await UserService.generateUsername(payload.email),
      };
      return data;
    } else {
      throw new Error(USER_RESPONSE.FB_AUTH_FAILED);
    }
  },

  createSession: async (body): Promise<ISession> => {
    //Logout pervious session
    const previousSession: ISession = await Session.findOne({ user: body.user }, {}, { sort: { created_at: -1 } });
    if (previousSession && !previousSession.logout) {
      await UserService.updateSession({ _id: previousSession._id }, { logout: new Date() });
    }

    const session = await Session.create(body);
    return session;
  },

  findSessions: async (user: string): Promise<ISessionArray> => {
    const session: ISessionArray = await Session.find({ user: user }).sort({ created_at: -1 }).lean();
    return session;
  },

  findSession: async (id: string, user: string): Promise<ISession> => {
    let query: ISession = {};
    if (id) {
      query._id = id;
    } else if (user) {
      query.user = user;
    }
    const session: ISession = await Session.findOne(query).sort({ created_at: -1 }).lean();
    return session;
  },

  updateSession: async (query: ISession, update: ISessionUpdate): Promise<boolean> => {
    let updatedSession = await Session.updateOne(query, update).lean();
    if (updatedSession.modifiedCount === 0) {
      throw new Error(USER_RESPONSE.SESSION_UPDATE_ERROR);
    }
    return true;
  },
};

export default UserService;
