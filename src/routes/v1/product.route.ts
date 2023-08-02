
import express from "express";
import UserController from "../../controllers/user.controller";
import ProductController from "../../controllers/product.controller";
import * as Validation from "../../helpers/validation.helper";
import expressValidator from "express-joi-validation";
const validator = expressValidator.createValidator({});
const router = express.Router();

router.post("/create_product", validator.body(Validation.createProduct), ProductController.createProduct);

router.post("/get_product", UserController.verifyToken, ProductController.getProduct);

router.post("/get_many_product", ProductController.getManyProduct);

router.post("/edit_product", validator.body(Validation.editProduct), UserController.verifyToken, ProductController.editProduct);

// router.post("/delete_product", validator.body(Validation.deleteProduct), UserController.verifyToken, ProductController.deleteProduct);

export default router;
