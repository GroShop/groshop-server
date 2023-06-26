import { Types } from "mongoose";
import { Request, Response, NextFunction } from "express";
import { NumberFilter } from "aws-sdk/clients/inspector2";

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
  reset_password_hash?: any;
  reset_password_expiry?: any;
  session?: any[];
  session_id?: Types.ObjectId;
  otp?: string;
  created_by?: Types.ObjectId;
  profile?: string;
  is_deleted?: boolean;
  created_at?: Date;
  modified_at?: Date;
  otp_verify?: boolean;
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

export interface IMongooseUpdate {
  acknowledged: Boolean;
  modifiedCount: number;
  upsertedId: any;
  upsertedCount: number;
  matchedCount: number;
  n?: number;
}

export interface IProduct {
  _id: string | Types.ObjectId;
  name?: string;
  price?: number;
  collection_pic?: Array<undefined>;
  product_pic?: string;
  tag?: Array<undefined>;
  categories?: string;
  description?: string;
  rating?: number;
  stock?: number;
  discount?: number;
}

export interface IPopulatedProduct {
  _id: string | Types.ObjectId;
  name?: string;
  price?: number;
  product_pic?: string;
  tag?: Array<undefined>;
  categories?: string;
  description?: string;
  rating?: number;
  stock?: number;
  discount?: number;
}

export interface ICreateProduct {
  name: string;
  price: number;
  product_pic: string;
  tag?: Array<undefined>;
  collection_pic?: Array<undefined>;
  categories?: string;
  description?: string;
  rating?: number;
  stock?: number;
  discount?: number;
}
export interface IQueryProduct {
  _id?: string | Types.ObjectId;
  is_deleted?: boolean;
  name?: string;
  price?: any;
  product_pic?: string;
  collection_pic?: Array<undefined>;
  tag?: Array<undefined>;
  categories?: string;
  description?: string;
  rating?: any;
  stock?: number;
  discount?: number;
}
export interface IPaginationProduct extends IPaginationResponse {
  docs: IPopulatedProduct[];
}
export interface IEditProduct {
  _id: string;
  name?: string;
  price?: number;
  product_pic?: string;
  tag?: Array<undefined>;
  collection_pic?: Array<undefined>;
  categories?: string;
  description?: string;
  rating?: number;
  stock?: number;
  discount?: number;
}
export interface IQuerySearchProduct {
  _id?: string | Types.ObjectId;
  $or?: Array<object>;
  collection_pic?: Array<undefined>;
  $and?: Array<object>;
  name?: string;
  price?: number;
  product_pic?: string;
  tag?: Array<undefined>;
  categories?: string;
  description?: string;
  rating?: number;
  stock?: number;
  discount?: number;
}

export interface ISearchProduct {
  _id: string | Types.ObjectId;
  product?: Array<string>;
  search_product?: Array<string>;
  created_by?: string;
}
export interface IPopulatedSearchProduct {
  _id: string | Types.ObjectId;
  product?: IProduct;
  search_product?: IProduct;
  created_by?: IUser;
}

export interface ICreateSearchProduct {
  product?: Array<String> | any;
  search_product?: Array<String> | any;
  created_by?: string;
}
export interface IQuerySearchProduct {
  _id?: string | Types.ObjectId;
  is_deleted?: boolean;
  product?: string;
  search_product?: string;
  created_by?: string;
}
export interface IPaginationSearchProduct extends IPaginationResponse {
  docs: IPopulatedSearchProduct[];
}
export interface IEditSearchProduct {
  _id: string;
  product?: IProduct;
  search_product?: IProduct;
  created_by?: IUser;
}
export interface IQuerySearchProduct {
  _id?: string | Types.ObjectId;
  $or?: Array<object>;
  $and?: Array<object>;
  product?: string;
  search_product?: string;
  created_by?: string;
}

export interface Iwishlist {
  _id: string | Types.ObjectId;
  wishlist_product?: [];
  created_by?: string;
}

export interface IPopulatedwishlist {
  _id: string | Types.ObjectId;
  wishlist_product?: IProduct;
  created_by?: IUser;
}

export interface ICreatewishlist {
  wishlist_product?: Array<String>;
  created_by?: string;
}
export interface IQuerywishlist {
  _id?: string;
  is_deleted?: boolean;
  wishlist_product?: string;
  created_by?: string;
}
export interface IPaginationwishlist extends IPaginationResponse {
  docs: IPopulatedwishlist[];
}
export interface IEditwishlist {
  _id: string;
  wishlist_product?: IProduct;
  created_by?: IUser;
}
export interface IQuerySearchwishlist {
  _id?: string;
  $or?: Array<object>;
  $and?: Array<object>;
  wishlist_product?: string;
  created_by?: string;
}

export interface ICart {
  _id: string | Types.ObjectId;
  cart_product?: string;
  status?: string;
  weight?: number;
  created_by?: string;
}

export interface IPopulatedCart {
  _id: string | Types.ObjectId;
  cart_product?: IProduct;
  status?: string;
  weight?: number;
  created_by?: IUser;
}

export interface ICreateCart {
  cart_product: string;
  status?: string;
  weight: number;
  created_by?: string;
}
export interface IQueryCart {
  _id?: string;
  is_deleted?: boolean;
  cart_product?: string;
  status?: string;
  weight?: number;
  created_by?: string;
}
export interface IPaginationCart extends IPaginationResponse {
  docs: IPopulatedCart[];
}
export interface IEditCart {
  _id: string;
  cart_product?: IProduct;
  status?: string;
  weight?: number;
  created_by?: IUser;
}
export interface IQuerySearchCart {
  _id?: string;
  $or?: Array<object>;
  $and?: Array<object>;
  cart_product?: string;
  status?: string;
  weight?: number;
  created_by?: string;
}
