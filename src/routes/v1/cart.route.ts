
import express from "express";
import UserController from "../../controllers/user.controller";
import CartController from "../../controllers/cart.controller";
import * as Validation from "../../helpers/validation.helper";
import expressValidator from "express-joi-validation";
const validator = expressValidator.createValidator({});
const router = express.Router();

router.post("/create_cart", validator.body(Validation.createCart), UserController.verifyToken, CartController.createCart);

router.post("/get_cart", UserController.verifyToken, CartController.getCart);

router.post("/get_many_cart", UserController.verifyToken, CartController.getManyCart);

router.post("/edit_cart", validator.body(Validation.editCart), UserController.verifyToken, CartController.editCart);

router.post("/delete_cart", validator.body(Validation.deleteCart), UserController.verifyToken, CartController.deleteCart);

export default router;
