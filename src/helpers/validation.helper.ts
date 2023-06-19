import Joi from "joi";

export const createUser = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().optional(),
});

export const editUser = Joi.object({
  username: Joi.string().optional(),
  password: Joi.string().optional(),
  id: Joi.string().required(),
});

export const userLogin = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const socialLogin = Joi.object({
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  username: Joi.string().optional(),
  email: Joi.string().email().required(),
  social_account_type: Joi.string().required(),
});

export const login = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const createProduct = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  product_pic: Joi.string().required(),
  tag: Joi.array().optional(),
  categories: Joi.string().optional(),
  description: Joi.string().optional(),
  rating: Joi.number().optional(),
  stock: Joi.number().optional(),
  discount: Joi.number().optional(),
});

export const editProduct = Joi.object({
  product_id: Joi.string().required(),
  name: Joi.string().optional(),
  price: Joi.number().optional(),
  product_pic: Joi.string().optional(),
  rating: Joi.string().optional(),
});

export const deleteProduct = Joi.object({
  product_id: Joi.string().required(),
});
