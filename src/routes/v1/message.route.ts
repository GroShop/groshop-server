
import express from "express";
import UserController from "../../controllers/user.controller";
import MessageController from "../../controllers/message.controller";
import * as Validation from "../../helpers/validation.helper";
import expressValidator from "express-joi-validation";
const validator = expressValidator.createValidator({});
const router = express.Router();

router.post("/create_message", validator.body(Validation.createMessage), UserController.verifyToken, MessageController.createMessage);

router.post("/get_message", UserController.verifyToken, MessageController.getMessage);

router.post("/get_many_message", UserController.verifyToken, MessageController.getManyMessage);

router.post("/edit_message", validator.body(Validation.editMessage), UserController.verifyToken, MessageController.editMessage);

router.post("/delete_message", validator.body(Validation.deleteMessage), UserController.verifyToken, MessageController.deleteMessage);

export default router;
