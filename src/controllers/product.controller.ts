import ProductService from "../services/product.service";
import _ from "lodash";
import { STATUS, PRODUCT_RESPONSE } from "../constants/response.constant";
import { IRequest, IResponse, INextFunction, IQuerySearchProduct } from "../helpers/interface.helper";
import HTTP from "http-status-codes";

const ProductController = {
  createProduct: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      let getProduct = await ProductService.getProduct({ name: req.body.name });
      if (getProduct) return res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: PRODUCT_RESPONSE.ALREADY_EXIST });
      const product = await ProductService.createProduct(req.body);
      if (product) {
        res.send({
          status: STATUS.SUCCESS,
          message: PRODUCT_RESPONSE.CREATE_SUCCESS,
          data: product,
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.SUCCESS, message: PRODUCT_RESPONSE.CREATE_FAILED });
      }
    } catch (err) {
      err.description = PRODUCT_RESPONSE.CREATE_FAILED;
      next(err);
    }
  },
  getProduct: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const product = await ProductService.getProduct({ _id: req.body.product_id });
      if (!_.isEmpty(product)) {
        res.send({ status: STATUS.SUCCESS, message: PRODUCT_RESPONSE.GET_SUCCESS, data: product });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: PRODUCT_RESPONSE.GET_FAILED });
      }
    } catch (err) {
      err.description = PRODUCT_RESPONSE.GET_FAILED;
      next(err);
    }
  },
  getManyProduct: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const { skip = 0, limit = 10, search } = req.body;
      let query: any = {};
      if (search && search.length > 0) {
        query = {
          ...query,
          $or: [{ name: { $regex: search, $options: "i" } }, { categories: { $regex: search, $options: "i" } }],
        };
      }
      if (!_.isEmpty(req.body.tag)) {
        query.tag = { $in: req.body.tag };
      }
      if (!_.isEmpty(req.body.categories)) {
        query.categories = req.body.categories ;
      }
      if (_.isNumber(req.body.min_price)) {
        query.price = { $gt: req.body.min_price, $lt: req.body.max_price };
      }
      if (_.isNumber(req.body.max_rating)) {
        query.rating = { $gt: req.body.min_rating, $lt: req.body.max_rating };
      }     
      const products = await ProductService.getManyProduct(query, { sort: { created_at: -1 } });
      res.send({
        status: STATUS.SUCCESS,
        message: PRODUCT_RESPONSE.GET_MANY_SUCCESS,
        data: products,
      });
    } catch (err) {
      err.description = PRODUCT_RESPONSE.GET_MANY_FAILED;
      next(err);
    }
  },
  getManyProductWithPagination: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const { skip = 0, limit = 10, search } = req.body;
      let query: any = {};
      if (search && search.length > 0) {
        query = {
          ...query,
          $or: [{ name: { $regex: search, $options: "i" } }, { categories: { $regex: search, $options: "i" } }],
        };
      }
      if (!_.isEmpty(req.body.tag)) {
        query.tag = { $in: req.body.tag };
      }
      if (!_.isEmpty(req.body.categories)) {
        query.categories = req.body.categories ;
      }
      if (_.isNumber(req.body.min_price)) {
        query.price = { $gt: req.body.min_price, $lt: req.body.max_price };
      }
      if (_.isNumber(req.body.max_rating)) {
        query.rating = { $gt: req.body.min_rating, $lt: req.body.max_rating };
      }     
      const products = await ProductService.getManyProductWithPagination(query, { sort: { created_at: -1 } });
      res.send({
        status: STATUS.SUCCESS,
        message: PRODUCT_RESPONSE.GET_MANY_SUCCESS,
        data: products,
      });
    } catch (err) {
      err.description = PRODUCT_RESPONSE.GET_MANY_FAILED;
      next(err);
    }
  },
  editProduct: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const { ...body } = req.body;
      const editedProduct = await ProductService.editProduct({ _id: req.body.product_id }, body);
      if (editedProduct) {
        const query = {
          _id: req.body.product_id,
        };
        const product = await ProductService.getProduct(query);
        res.send({
          status: STATUS.SUCCESS,
          message: PRODUCT_RESPONSE.EDIT_SUCCESS,
          data: product,
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: PRODUCT_RESPONSE.EDIT_FAILED });
      }
    } catch (err) {
      err.description = PRODUCT_RESPONSE.EDIT_FAILED;
      next(err);
    }
  },
  // deleteProduct: async (req: IRequest, res: IResponse, next: INextFunction) => {
  //   try {
  //     const deleteProduct = await ProductService.deleteProduct({ _id: req.body.product_id });
  //     if (deleteProduct) {
  //       res.send({
  //         status: STATUS.SUCCESS,
  //         message: PRODUCT_RESPONSE.DELETE_SUCCESS,
  //       });
  //     } else {
  //       res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: PRODUCT_RESPONSE.DELETE_FAILED });
  //     }
  //   } catch (err) {
  //     err.description = PRODUCT_RESPONSE.DELETE_FAILED;
  //     next(err);
  //   }
  // },
};

export default ProductController;
