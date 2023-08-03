import CartService from "../services/cart.service";
import _ from "lodash";
import { STATUS, CART_RESPONSE } from "../constants/response.constant";
import { IRequest, IResponse, INextFunction, IQuerySearchCart } from "../helpers/interface.helper";
import HTTP from "http-status-codes";
import { CART } from "../constants/cart.constant";

const CartController = {
  createCart: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      let getCart = await CartService.getCart({ created_by: req.decoded.id, status: { $nin: [CART.PAYMENT_SUCCESS] } });
      let cart: any;
      if (!_.isEmpty(getCart)) {
        if (_.some(getCart.cart_product, e => e.product.toString() === req.body.product)) {
          return res.send({ status: STATUS.SUCCESS, message: CART_RESPONSE.ALREADY_EXIST });
        }
        let update: any = { $push: { cart_product: req.body } };
        cart = CartService.addCart({ created_by: req.decoded.id }, update);
      } else {
        let query: any = {
          created_by: req.decoded.id,
          cart_product: [req.body],
        };
        cart = await CartService.createCart(query);
      }
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
      const query: any = {
        created_by: req.decoded.id,
        ...req.body,
      };
      if (req.body.status !== CART.PAYMENT_SUCCESS) {
        query.status = { $nin: [CART.PAYMENT_SUCCESS] };
      }
      const cart = await CartService.getCart(query);
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
      const { search } = req.body;
      let query: IQuerySearchCart = {
        created_by: req.decoded.id,
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
      let body: any = {
        ...req.body,
      };
      delete body.cart_id;
      const editedCart = await CartService.editCart({ _id: req.body.cart_id }, body);
      if (editedCart) {
        const query = {
          _id: req.body.cart_id,
        };
        const cart = await CartService.getCart(query);
        console.log("cart", cart);

        res.send({
          status: STATUS.SUCCESS,
          message: CART_RESPONSE.EDIT_SUCCESS,
          // data: cart,
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: CART_RESPONSE.EDIT_FAILED });
      }
    } catch (err) {
      console.log("err", err);

      next(err);
    }
  },
  deleteCart: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      let query = {
        ...req.body,
      };
      delete query.cart_id;
      let update: any = {$pull:  {cart_product:   query } };
      const deleteCart = CartService.addCart({ _id: req.body.cart_id }, update);
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
