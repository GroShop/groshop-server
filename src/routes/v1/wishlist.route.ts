import express from "express";
import UserController from "../../controllers/user.controller";
import wishlistController from "../../controllers/wishlist.controller";
import * as Validation from "../../helpers/validation.helper";
import expressValidator from "express-joi-validation";
const validator = expressValidator.createValidator({});
const router = express.Router();

router.post("/create_wishlist", validator.body(Validation.createwishlist), UserController.verifyToken, wishlistController.createWishlist);

router.post("/get_wishlist", UserController.verifyToken, wishlistController.getWishlist);

router.post("/get_many_wishlist", UserController.verifyToken, wishlistController.getManyWishlist);

router.post("/edit_wishlist", validator.body(Validation.editwishlist), UserController.verifyToken, wishlistController.editedWishlist);

router.post("/remove_wishlist", UserController.verifyToken, wishlistController.removeWishlist);

router.post("/delete_wishlist", validator.body(Validation.deletewishlist), UserController.verifyToken, wishlistController.deleteWishlist);

export default router;
