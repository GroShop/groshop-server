// @ts-nocheck
import express from "express";
import userController from "../../controllers/user.controller";
import _MN_Controller from "../../controllers/_MN_.controller";
import * as Validation from "../../helpers/validation.helper";
import expressValidator from "express-joi-validation";
const validator = expressValidator.createValidator({});
const router = express.Router();

router.post("/create__MN_", validator.body(Validation.create_MNS_), userController.verifyToken, _MN_Controller.create_MNS_);

router.post("/get__MN_", userController.verifyToken, _MN_Controller.get_MNS_);

router.post("/get_many__MN_", userController.verifyToken, _MN_Controller.getMany_MNS_);

router.post("/edit__MN_", validator.body(Validation.edit_MNS_), userController.verifyToken, _MN_Controller.edit_MNS_);

router.post("/delete__MN_", validator.body(Validation.delete_MNS_), userController.verifyToken, _MN_Controller.delete_MNS_);

export default router;
