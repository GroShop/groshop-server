
import express from "express";
import UserController from "../../controllers/user.controller";
import ChatController from "../../controllers/chat.controller";
import * as Validation from "../../helpers/validation.helper";
import expressValidator from "express-joi-validation";
const validator = expressValidator.createValidator({});
const router = express.Router();

router.post("/create_chat", validator.body(Validation.createChat), UserController.verifyToken, ChatController.createChat);

router.post("/get_chat", UserController.verifyToken, ChatController.getChat);

router.post("/get_many_chat", UserController.verifyToken, ChatController.getManyChat);

router.post("/edit_chat", validator.body(Validation.editChat), UserController.verifyToken, ChatController.editChat);

router.post("/delete_chat", validator.body(Validation.deleteChat), UserController.verifyToken, ChatController.deleteChat);

export default router;
