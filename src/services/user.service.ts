import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";

import User from "../models/user.model";
import Session from "../models/session.model";

import crypto from "../helpers/crypto.helper";
import { USER_RESPONSE } from "../constants/response.constant";
import { EMAIL, EMAIL_TEMPLATES } from "../constants/email.constant";

import { IUser, IUserArray, IMongooseUpdate } from "../helpers/interface.helper";
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

  // sendConfirmationMail: async (email: string) => {
  //   let user: IUser = await UserService.userDetails(undefined, email);

  //   //Send mail
  //   var id = new mongoose.Types.ObjectId();
  //   let html = await EMAIL_TEMPLATES.confirmEmail(user.first_name, id);
  //   const response = await Mail("", email, EMAIL.CONFIRM_EMAIL_SUBJECT, "", html);
  //   if (response) {
  //     let body = {
  //       email_confirmation_id: id,
  //     };
  //     let update: IMongooseUpdate = await User.updateOne({ email: email }, body);
  //     if (update.n === 0) {
  //       return false;
  //     }
  //     return true;
  //   } else {
  //     return false;
  //   }
  // },

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



  isUsernameExist: async (username: string): Promise<boolean> => {
    let count = await User.countDocuments({ username: username });
    if (count > 0) {
      return false;
    } else {
      return true;
    }
  },


};

export default UserService;
