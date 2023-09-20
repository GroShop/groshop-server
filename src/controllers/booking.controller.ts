import BookingService from "../services/booking.service";
import _ from "lodash";
import { STATUS, BOOKING_RESPONSE } from "../constants/response.constant";
import { IRequest, IResponse, INextFunction, IQuerySearchBooking } from "../helpers/interface.helper";
import HTTP from "http-status-codes";
import RazorPayService from "../services/razorpay.service";
import { BOOKING, CART } from "../constants/cart.constant";
import { webhookValidation } from "../helpers/functions.helper";
import CartService from "../services/cart.service";

const BookingController = {
  createBooking: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      // let getBooking = await BookingService.getBooking({});
      // if (getBooking) return res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: BOOKING_RESPONSE.ALREADY_EXIST });
      const { ...body } = req.body;
      const createOrder = await RazorPayService.createOrder(body.order);
      delete body.order;
      body.status = BOOKING.QUEUED;
      body.created_by = req.decoded.id;
      body.razorpay_order_id = createOrder.id;
      const booking = await BookingService.createBooking(body);

      if (booking) {
        res.send({
          status: STATUS.SUCCESS,
          message: BOOKING_RESPONSE.CREATE_SUCCESS,
          data: booking,
        });
        await CartService.editCart({_id:req.body.cart},{status:CART.PAYMENT_SUCCESS})
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.SUCCESS, message: BOOKING_RESPONSE.CREATE_FAILED });
      }
    } catch (err) {
      err.description = BOOKING_RESPONSE.CREATE_FAILED;
      next(err);
    }
  },
  getBooking: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const booking = await BookingService.getBooking({ _id: req.body.booking_id });
      if (!_.isEmpty(booking)) {
        res.send({ status: STATUS.SUCCESS, message: BOOKING_RESPONSE.GET_SUCCESS, data: booking });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: BOOKING_RESPONSE.GET_FAILED });
      }
    } catch (err) {
      err.description = BOOKING_RESPONSE.GET_FAILED
      next(err);
    }
  },
  getManyBooking: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const { skip = 0, limit = 10, search } = req.body;
      let query: IQuerySearchBooking = {};
      if (search && search.length > 0) {
        query = {
          ...query,
          $or: [{ amount: { $regex: search, $options: "i" } }, { cart: { $regex: search, $options: "i" } }],
        };
      }
      const bookings = await BookingService.getManyBooking(query, {  sort: { created_at: -1 } });
      res.send({
        status: STATUS.SUCCESS,
        message: BOOKING_RESPONSE.GET_MANY_SUCCESS,
        data: bookings,
      });
    } catch (err) {
      err.description = BOOKING_RESPONSE.GET_MANY_FAILED;
      next(err);
    }
  },
  getManyBookingPagination: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const { skip = 0, limit = 10, search } = req.body;
      let query: IQuerySearchBooking = {};
      if (search && search.length > 0) {
        query = {
          ...query,
          $or: [{ amount: { $regex: search, $options: "i" } }, { cart: { $regex: search, $options: "i" } }],
        };
      }
      const bookings = await BookingService.getManyBookingWithPagination(query, { skip, limit, sort: { created_at: -1 } });
      res.send({
        status: STATUS.SUCCESS,
        message: BOOKING_RESPONSE.GET_MANY_SUCCESS,
        data: bookings,
      });
    } catch (err) {
      err.description = BOOKING_RESPONSE.GET_MANY_FAILED;
      next(err);
    }
  },
  editBooking: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const { ...body } = req.body;
      const editedBooking = await BookingService.editBooking({ _id: req.body.booking_id }, body);
      if (editedBooking) {
        const query = {
          _id: req.body.booking_id,
        };
        const booking = await BookingService.getBooking(query);
        res.send({
          status: STATUS.SUCCESS,
          message: BOOKING_RESPONSE.EDIT_SUCCESS,
          data: booking,
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: BOOKING_RESPONSE.EDIT_FAILED });
      }
    } catch (err) {
      err.description = BOOKING_RESPONSE.EDIT_FAILED;
      next(err);
    }
  },
  deleteBooking: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const deleteBooking = await BookingService.deleteBooking({ _id: req.body.booking_id });
      if (deleteBooking) {
        res.send({
          status: STATUS.SUCCESS,
          message: BOOKING_RESPONSE.DELETE_SUCCESS,
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: BOOKING_RESPONSE.DELETE_FAILED });
      }
    } catch (err) {
      err.description = BOOKING_RESPONSE.DELETE_FAILED;
      next(err);
    }
  },
  webhookBooking: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      let webhook: any = await webhookValidation(req.body, req.headers["x-razorpay-signature"]);
      if(webhook){
        switch (req.body.event) {
          case "payment.authorized":
            console.log(' webhook.payload.payment.entity', req.body.payload.payment.entity);
            
          const { order_id, id } = req.body.payload.payment.entity;
          const getBooking = await BookingService.getBooking({ razorpay_order_id: order_id });
          let query:any = {
            razorpay_payment_id: id,
            razorpay: req.body.payload.payment.entity,
            status: BOOKING.ORDERED_PLACED,
            tracking_status: [{
              status: BOOKING.ORDERED_PLACED,
              created_at: new Date(),
            }],
          };
          const update = await BookingService.editBooking({ _id: getBooking._id }, query);
          if(!update){
            res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: BOOKING_RESPONSE.PAYMENT_FAILED });
          }
          res.send({
            status: STATUS.SUCCESS,
            message: BOOKING_RESPONSE.PAYMENT_SUCCESS,
          });
          break;
      }
    }
    else{
      res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: BOOKING_RESPONSE.PAYMENT_FAILED });
    }
   
    } catch (err) {
      err.description = BOOKING_RESPONSE.DELETE_FAILED;
      next(err);
    }
  },
};

export default BookingController;
