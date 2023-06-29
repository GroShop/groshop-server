export const STATUS = {
  SUCCESS: "success",
  FAILED: "failed",
};

export const USER_RESPONSE = {
  SUCCESS: "success",
  FAILED: "failed",
  USER_CREATED: "User Created Successfully",
  USER_EXIST: "User Exist",
  USER_MODIFIED: "User Modified",
  USER_FETCHED: "User Fetched",
  RESENT_CONFIRMATION: "Resent Confirmation Mail",
  EMAIL_CONFIRMED: "Email Confirmed Successfully",
  RESET_PASSWORD_SENT: "Reset Password has been Sent to the E-mail",
  PASSWORD_CHANGED: "Password Changed",
  OTP_SENT: "OTP has been Sent to your registered email",
  OTP_VERIFIED: "OTP has been verified",
  USER_LOGGED_OUT: "User logged out",
  UNAUTHORIZED: "Unauthorized user",

  //errors
  USER_UPDATE_ERROR: "Failed to update user",
  SESSION_UPDATE_ERROR: "Failed to update session",
  NO_TOKEN_PROVIDED: "No token provided",
  INVALID_TOKEN: "Invalid token",
  TOKEN_ERROR: "Failed to authenticate token",
  TOKEN_USER_DOESNT_EXIST: "Token user does not exist",
  USER_DOESNT_EXIST: "User doesn't exist",
  CONFIRMATION_EMAIL_FAILED: "Failed to send confirmation email",
  FAILED_TO_CONFIRM_EMAIL: "Failed to confirm email",
  INCORRECT_PASSWORD: "Incorrect password",
  SIGNUP_FAILED: "Signup failed",
  LOGIN_FAILED: "Login failed",
  EMAIL_ALREADY_EXIST: "Email Already Exists",
  EMAIL_NOT_EXIST: "Email doesn't Exists",
  FAILED_TO_SEND_MAIL: "Failed to Send Mail",
  FAILED_TO_RESET_PASSWORD: "Failed to reset password",
  FAILED_TO_CHANGE_PASSWORD: "Failed to change password",
  FAILED_TO_SEND_OTP: "Failed to send otp message",
  FAILED_TO_VERIFY_OTP: "Failed to verify otp",
  INVALID_OTP: "Invalid OTP",
  FAILED_TO_EDIT_USER: "Failed to edit user",
  FAILED_TO_FETCH_USER: "Failed to fetch user",
  LOGOUT_FAILED: "Failed to fetch user",
  FB_AUTH_FAILED: "Failed to authenticate Facebook account",
  SEND_OTP:"Send otp successfully",
  SEND_OTP_FAILED:"Send otp failed",
  VERIFY_OTP:"Verify otp successfully",
  VERIFY_OTP_FAILED:"Verify otp failed"
};

export const NOTIFICATION_RESPONSE = {
  SUCCESS: STATUS.SUCCESS,
  GET_MANY_SUCCESS: "Notifications found",
  UPDATED: "Notification updated successfully",

  //errors
  FAILED: STATUS.FAILED,
  GET_MANY_FAILED: "Failed to fetch Notifications",
  UPDATE_FAILED: "Notification update failed",
};

export const PRODUCT_RESPONSE ={
  CREATE_SUCCESS: "Created product successfully",
  CREATE_FAILED:"Created product failed",
  GET_SUCCESS:"Get product success",
  GET_FAILED:"Get product failed",
  ALREADY_EXIST:"Product Already exist",
  GET_MANY_SUCCESS:"Get all product successfully",
  GET_MANY_FAILED:"Get all product failed",
  EDIT_SUCCESS:"Edit product successfully",
  EDIT_FAILED:"edit product failed"
}
export const SEARCHPRODUCT_RESPONSE = {
  CREATE_SUCCESS: "searchProduct created successfully",
  CREATE_FAILED: "Failed to create searchproduct",
  GET_SUCCESS: "searchProduct found",
  GET_FAILED: "searchProduct not found",
  GET_MANY_SUCCESS: "searchProducts found",
  GET_MANY_FAILED: "searchProducts not found",
  EDIT_SUCCESS: "searchProduct edited successfully",
  EDIT_FAILED: "Failed to edit searchproduct",
  DELETE_SUCCESS: "searchProduct deleted successfully",
  DELETE_FAILED: "Failed to delete searchproduct",
  ALREADY_EXIST: "searchProduct already exists",
};

export const WISHLIST_RESPONSE = {
  CREATE_SUCCESS: "wishlist created successfully",
  CREATE_FAILED: "Failed to create wishlist",
  GET_SUCCESS: "wishlist found",
  GET_FAILED: "wishlist not found",
  GET_MANY_SUCCESS: "wishlists found",
  GET_MANY_FAILED: "wishlists not found",
  EDIT_SUCCESS: "wishlist edited successfully",
  EDIT_FAILED: "Failed to edit wishlist",
  DELETE_SUCCESS: "wishlist deleted successfully",
  DELETE_FAILED: "Failed to delete wishlist",
  ALREADY_EXIST: "wishlist already exists",
};

export const CART_RESPONSE = {
  CREATE_SUCCESS: "Cart created successfully",
  CREATE_FAILED: "Failed to create cart",
  GET_SUCCESS: "Cart found",
  GET_FAILED: "Cart not found",
  GET_MANY_SUCCESS: "Carts found",
  GET_MANY_FAILED: "Carts not found",
  EDIT_SUCCESS: "Cart edited successfully",
  EDIT_FAILED: "Failed to edit cart",
  DELETE_SUCCESS: "Cart deleted successfully",
  DELETE_FAILED: "Failed to delete cart",
  ALREADY_EXIST: "You have this item in your cart already",
};

export const VOUCHER_RESPONSE = {
  CREATE_SUCCESS: "Voucher created successfully",
  CREATE_FAILED: "Failed to create voucher",
  GET_SUCCESS: "Voucher found",
  GET_FAILED: "Voucher not found",
  GET_MANY_SUCCESS: "Vouchers found",
  GET_MANY_FAILED: "Vouchers not found",
  EDIT_SUCCESS: "Voucher edited successfully",
  EDIT_FAILED: "Failed to edit voucher",
  DELETE_SUCCESS: "Voucher deleted successfully",
  DELETE_FAILED: "Failed to delete voucher",
  ALREADY_EXIST: "Voucher already exists",
};
