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
  price: Joi.number().optional(),
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

export const createSearchProduct = Joi.object({
  product_id: Joi.string().optional(),
  search_product: Joi.string().optional(),
  created_by: Joi.string().optional(),
});

export const editSearchProduct = Joi.object({
  search_product: Joi.string().optional(),
  product: Joi.array().optional(),
});

export const deleteSearchProduct = Joi.object({
  search_product_id: Joi.string().required(),
});

export const createwishlist = Joi.object({
  wishlist_product: Joi.string().optional(),
  created_by: Joi.string().optional(),
  cart: Joi.string().optional()
});

export const editwishlist = Joi.object({
  wishlist_id: Joi.string().required(),
  wishlist_product: Joi.string().optional(),
});

export const deletewishlist = Joi.object({
  wishlist_id: Joi.string().required(),
});

export const createCart = Joi.object({
  cart_product: Joi.string().required(),
  status: Joi.string().optional(),
  weight: Joi.number().required(),
  created_by: Joi.string().optional(),
});

export const editCart = Joi.object({
  cart_id: Joi.string().required(),
  cart_product: Joi.string().optional(),
  status: Joi.string().optional(),
  weight: Joi.number().optional(),
});

export const deleteCart = Joi.object({
  cart_id: Joi.string().required(),
});

export const createVoucher = Joi.object({
  name: Joi.string().required(),
discount: Joi.number().optional(),
expire_voucher: Joi.date().optional(),
user: Joi.string().optional(),
created_by: Joi.string().optional(),

});

export const editVoucher = Joi.object({
  voucher_id: Joi.string().required(),
  name: Joi.string().optional(),
discount: Joi.number().optional(),
expire_voucher: Joi.date().optional(),

});

export const deleteVoucher = Joi.object({
  voucher_id: Joi.string().required(),
});
