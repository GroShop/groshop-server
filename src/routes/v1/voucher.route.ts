
import express from "express";
import UserController from "../../controllers/user.controller";
import VoucherController from "../../controllers/voucher.controller";
import * as Validation from "../../helpers/validation.helper";
import expressValidator from "express-joi-validation";
const validator = expressValidator.createValidator({});
const router = express.Router();

router.post("/create_voucher", validator.body(Validation.createVoucher), UserController.verifyToken, VoucherController.createVoucher);

router.post("/get_voucher", UserController.verifyToken, VoucherController.getVoucher);

router.post("/get_many_voucher", UserController.verifyToken, VoucherController.getManyVoucher);

router.post("/edit_voucher", validator.body(Validation.editVoucher), UserController.verifyToken, VoucherController.editVoucher);

router.post("/delete_voucher", validator.body(Validation.deleteVoucher), UserController.verifyToken, VoucherController.deleteVoucher);

export default router;
