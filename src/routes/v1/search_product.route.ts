
import express from "express";
import UserController from "../../controllers/user.controller";
import searchProductController from "../../controllers/search_product.controller";
import * as Validation from "../../helpers/validation.helper";
import expressValidator from "express-joi-validation";
const validator = expressValidator.createValidator({});
const router = express.Router();

router.post("/create_search_product", validator.body(Validation.createSearchProduct), UserController.verifyToken, searchProductController.createSearchProduct);

router.post("/get_search_product", UserController.verifyToken, searchProductController.getSearchProduct);

router.post("/get_many_search_product", UserController.verifyToken, searchProductController.getManySearchProduct);

router.post("/edit_search_product", validator.body(Validation.editSearchProduct), UserController.verifyToken, searchProductController.editSearchProduct);

router.post("/delete_search_product", validator.body(Validation.deleteSearchProduct), UserController.verifyToken, searchProductController.deleteSearchProduct);

export default router;
