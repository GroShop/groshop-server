import { Router } from "express";
import UserController from "../../controllers/user.controller";
import * as Validation from "../../helpers/validation.helper";
import expressValidator from "express-joi-validation";
const validator = expressValidator.createValidator({});
const router = Router();

router.get("/test", UserController.test);

router.post("/user_signup", validator.body(Validation.createUser), UserController.userSignup);

router.post("/user_login", validator.body(Validation.userLogin), UserController.userLogin);

router.post("/edit_user", UserController.verifyToken, UserController.editUser);

router.post("/view_user", UserController.verifyToken, UserController.viewUser);

router.post("/send_otp", UserController.sendOtp);

router.post("/verify_otp", UserController.verifyOtp);

router.post("/reset_password", UserController.editPassword);

router.post("/view_user", UserController.verifyToken, UserController.viewUser);

router.post("/social_signin", UserController.socialSignIn);

router.post("/add_address",UserController.verifyToken, UserController.addAddress);

export default router;
