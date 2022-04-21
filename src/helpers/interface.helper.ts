import { Types } from "mongoose";
import { Request, Response, NextFunction } from "express";

export interface IRequest extends Request {
  decoded: IDecoded;
}

export interface IResponse extends Response {}

export interface INextFunction extends NextFunction {}

export interface IDecoded {
  id: string;
}

export interface IUser {
  _id?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  confirmed?: boolean;
  social_account_type?: string;
  email_confirmation_id?: string;
  first_name?: string;
  last_name?: string;
  reset_password_hash?: any;
  reset_password_expiry?: any;
  session?: any[];
  session_id?: Types.ObjectId;
  otp?: string;
  created_by?: Types.ObjectId;
  phone?: string;
  profile?: string;
  health?: any[];
  is_deleted?: boolean;
  created_at?: Date;
  modified_at?: Date;
}

export interface IUserList {
  docs?: Array<Object>;
  totalDocs?: number;
  limit?: number;
  totalPages?: number;
}

export type IUserArray = IUser[];
export interface IUserQuery {
  _id?: string;
  email?: string;
  is_deleted?: boolean;
  role?: string;
  name?: any;
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
  user_id?: string;
  user?: string;
  org?: any;
  project?: any;
  client?: string;
}

export interface ISession {
  _id?: any;
  user?: string;
  logout?: Date;
  created_at?: Date;
  modified_at?: Date;
}

export interface ISessionUpdate {
  user?: string;
  logout?: Date;
}

export type ISessionArray = ISession[];

export interface IPaginationResponse {
  totalDocs: number;
  skip: number;
  limit: number;
}

export interface IPushNotification {
  token: string;
  title: string;
  body: string;
  image?: string;
  isScheduled?: boolean;
  scheduledTime?: Date;
}
export interface INotification {
  _id?: string;
  user?: IUser;
  title?: string;
  body?: string;
  type?: string;
  redirect_to?: string;
  seen?: boolean;
  from?: string;
  merge_fields?: any;
  data?: any;
  is_deleted?: boolean;
  created_at?: string;
  modified_at?: string;
}

export interface IPaginationNotification extends IPaginationResponse {
  docs: INotification[];
}
export interface IGetNotification {
  _id?: string;
  user?: string;
  title?: string;
  body?: string;
  type?: string;
  redirect_to?: string;
  seen?: boolean;
  from?: string;
  is_deleted?: boolean;
  created_at?: string;
  modified_at?: string;
}

export interface ICreateNotification {
  user?: string;
  title?: string;
  body?: string;
  type?: string;
  redirect_to?: string;
  seen?: boolean;
  from?: string;
  merge_fields?: any;
  data?: any;
  category: string;
  message: string;
}

export interface IMongooseUpdate {
  acknowledged: Boolean;
  modifiedCount: number;
  upsertedId: any;
  upsertedCount: number;
  matchedCount: number;
  n?: number;
}

export interface IPaginationOption {
  skip: number;
  limit: number;
}

export interface IWinston {
  log: any;
  error: any;
  info: any;
}
