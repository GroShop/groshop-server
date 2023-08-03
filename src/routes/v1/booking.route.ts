
import express from "express";
import UserController from "../../controllers/user.controller";
import BookingController from "../../controllers/booking.controller";
import * as Validation from "../../helpers/validation.helper";
import expressValidator from "express-joi-validation";
const validator = expressValidator.createValidator({});
const router = express.Router();

router.post("/create_booking", UserController.verifyToken, BookingController.createBooking);

router.post("/get_booking", UserController.verifyToken, BookingController.getBooking);

router.post("/get_many_booking", UserController.verifyToken, BookingController.getManyBooking);

router.post("/edit_booking", validator.body(Validation.editBooking), UserController.verifyToken, BookingController.editBooking);

router.post("/delete_booking", validator.body(Validation.deleteBooking), UserController.verifyToken, BookingController.deleteBooking);

router.post("/webhooks",  BookingController.deleteBooking);

export default router;
// validator.body(Validation.createBooking)