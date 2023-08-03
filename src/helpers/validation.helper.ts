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
  cart: Joi.string().optional(),
});

export const editwishlist = Joi.object({
  wishlist_id: Joi.string().required(),
  wishlist_product: Joi.string().optional(),
});

export const deletewishlist = Joi.object({
  wishlist_id: Joi.string().required(),
});

export const createCart = Joi.object({
  product: Joi.string().required(),
  weight: Joi.number().required(),
  status: Joi.string().optional(),
  created_by: Joi.string().optional(),
});

export const editCart = Joi.object({
  cart_id: Joi.string().optional(),
  product: Joi.string().optional(),
  weight: Joi.number().optional(),
  cart_product: Joi.array().optional(),
  status: Joi.string().optional(),
});

export const deleteCart = Joi.object({
  cart_id: Joi.string().optional(),
  product: Joi.string().optional(),
  weight: Joi.number().optional(),
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

export const createBooking = Joi.object({
  amount: Joi.number().required(),
  cart: Joi.string().required(),
  status: Joi.string().required(),
  payment_type: Joi.string().required(),
  delivery_time: Joi.string().optional(),
  address: Joi.object().required(),
  voucher: Joi.string().required(),
  razorpay_payment_id: Joi.string().optional(),
  razorpay_order_id: Joi.string().optional(),
  razorpay: Joi.object().optional(),
  created_by: Joi.string().optional(),
});

export const editBooking = Joi.object({
  booking_id: Joi.string().required(),
  amount: Joi.number().optional(),
  cart: Joi.string().optional(),
  status: Joi.string().optional(),
  payment_type: Joi.string().optional(),
  delivery_time: Joi.string().optional(),
  address: Joi.object().optional(),
  voucher: Joi.string().optional(),
  razorpay_payment_id: Joi.string().optional(),
  razorpay_order_id: Joi.string().optional(),
  razorpay: Joi.object().optional(),
});

export const deleteBooking = Joi.object({
  booking_id: Joi.string().required(),
});
