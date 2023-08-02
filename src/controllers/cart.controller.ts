import CartService from "../services/cart.service";
import _ from "lodash";
import { STATUS, CART_RESPONSE } from "../constants/response.constant";
import { IRequest, IResponse, INextFunction, IQuerySearchCart } from "../helpers/interface.helper";
import HTTP from "http-status-codes";

const CartController = {
  createCart: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      let getCart = await CartService.getCart({ cart_product: req.body.cart_product, created_by: req.decoded.id });
      if (getCart) return res.send({ status: STATUS.SUCCESS, message: CART_RESPONSE.ALREADY_EXIST });
      let query = {
        created_by: req.decoded.id,
        ...req.body,
      };
      const cart = await CartService.createCart(query);
      if (cart) {
        res.send({
          status: STATUS.SUCCESS,
          message: CART_RESPONSE.CREATE_SUCCESS,
          data: cart,
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.SUCCESS, message: CART_RESPONSE.CREATE_FAILED });
      }
    } catch (err) {
      err.description = CART_RESPONSE.CREATE_FAILED;
      next(err);
    }
  },
  getCart: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const cart = await CartService.getCart({ _id: req.body.cart_id });
      if (!_.isEmpty(cart)) {
        res.send({ status: STATUS.SUCCESS, message: CART_RESPONSE.GET_SUCCESS, data: cart });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: CART_RESPONSE.GET_FAILED });
      }
    } catch (err) {
      err.description = CART_RESPONSE.GET_FAILED;
      next(err);
    }
  },
  getManyCart: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const{search}=req.body
      let query: IQuerySearchCart = {
        created_by:req.decoded.id
      };

      if (search && search.length > 0) {
        query = {
          ...query,
          $or: [{ product: { $regex: search, $options: "i" } }, { status: { $regex: search, $options: "i" } }],
        };
      }
      const carts = await CartService.getManyCart(query);
      res.send({
        status: STATUS.SUCCESS,
        message: CART_RESPONSE.GET_MANY_SUCCESS,
        data: carts,
      });
    } catch (err) {
      err.description = CART_RESPONSE.GET_MANY_FAILED;
      next(err);
    }
  },
  getManyCartWithPagination: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const { skip = 0, limit = 10, search } = req.body;
      let query: IQuerySearchCart = {};
      if (search && search.length > 0) {
        query = {
          ...query,
          $or: [{ product: { $regex: search, $options: "i" } }, { status: { $regex: search, $options: "i" } }],
        };
      }
      const carts = await CartService.getManyCartWithPagination(query, { skip, limit, sort: { created_at: -1 } });
      res.send({
        status: STATUS.SUCCESS,
        message: CART_RESPONSE.GET_MANY_SUCCESS,
        data: carts,
      });
    } catch (err) {
      err.description = CART_RESPONSE.GET_MANY_FAILED;
      next(err);
    }
  },
  editCart: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const { ...body } = req.body;
      const editedCart = await CartService.editCart({ _id: req.body.cart_id }, body);
      if (editedCart) {
        const query = {
          _id: req.body.cart_id,
        };
        const cart = await CartService.getCart(query);
        res.send({
          status: STATUS.SUCCESS,
          message: CART_RESPONSE.EDIT_SUCCESS,
          data: cart,
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: CART_RESPONSE.EDIT_FAILED });
      }
    } catch (err) {
      err.description = CART_RESPONSE.EDIT_FAILED;
      next(err);
    }
  },
  deleteCart: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const deleteCart = await CartService.deleteCart({ _id: req.body.cart_id });
      if (deleteCart) {
        res.send({
          status: STATUS.SUCCESS,
          message: CART_RESPONSE.DELETE_SUCCESS,
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: CART_RESPONSE.DELETE_FAILED });
      }
    } catch (err) {
      err.description = CART_RESPONSE.DELETE_FAILED;
      next(err);
    }
  },
};

export default CartController;
