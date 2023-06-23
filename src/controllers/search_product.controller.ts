import searchProductService from "../services/search_product.service";
import _ from "lodash";
import { STATUS, SEARCHPRODUCT_RESPONSE } from "../constants/response.constant";
import { IRequest, IResponse, INextFunction, IQuerySearchProduct } from "../helpers/interface.helper";
import HTTP from "http-status-codes";

const searchProductController = {
  createSearchProduct: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      let query:any={
        created_by:req.decoded.id,
      } 
      const getManySearchProduct = await searchProductService.getManySearchProduct(query);
      if(_.isEmpty(getManySearchProduct)){
      if(!_.isEmpty(req.body.product_id)){
        query.product = [req.body.product_id];
      }
      if(!_.isEmpty(req.body.search_product)){
        query.search_product = [req.body.search_product];
      }
       let createSearchProduct=  await searchProductService.createSearchProduct(query);
        if (createSearchProduct) {
          res.send({
            status: STATUS.SUCCESS,
            message: SEARCHPRODUCT_RESPONSE.CREATE_SUCCESS,
            data: createSearchProduct,
          });
        }
        else {
          res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: SEARCHPRODUCT_RESPONSE.CREATE_FAILED });
        }
      }
      else{
        let key:string
        let body:string
        if(!_.isEmpty(req.body.product_id)){
          key="product"
          body = req.body.product_id;
        }
        if(!_.isEmpty(req.body.search_product)){
          key="search_product"
          body =req.body.search_product
        }
      await searchProductService.addSearchProduct(query,{$pull:{[`${key}`]:body}});
      let editSearchProduct=  await searchProductService.addSearchProduct(query,{$push:{[`${key}`]:{$each:[body],$position:0}}});
      if(editSearchProduct){
        res.send({
          status: STATUS.SUCCESS,
          message: SEARCHPRODUCT_RESPONSE.EDIT_SUCCESS,
        });
      }
      else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: SEARCHPRODUCT_RESPONSE.EDIT_FAILED});
      }
      }
   
    } catch (err) {
      err.description = SEARCHPRODUCT_RESPONSE.CREATE_FAILED;
      next(err);
    }
  },
  getSearchProduct: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      let query: IQuerySearchProduct = {
        created_by:req.decoded.id,
      };
      const searchproduct = await searchProductService.getSearchProduct(query);
      if (!_.isEmpty(searchproduct)) {
        res.send({ status: STATUS.SUCCESS, message: SEARCHPRODUCT_RESPONSE.GET_SUCCESS, data: searchproduct });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: SEARCHPRODUCT_RESPONSE.GET_FAILED });
      }
    } catch (err) {
      err.description = SEARCHPRODUCT_RESPONSE.GET_FAILED;
      next(err);
    }
  },
  getManySearchProduct: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const { skip = 0, limit = 10, search } = req.body;
      let query: IQuerySearchProduct = {
        created_by:req.decoded.id,
      };
      if (search && search.length > 0) {
        query = {
          $or: [{ product: { $regex: search, $options: "i" } }, { search_product: { $regex: search, $options: "i" } }],
        };
      }
      const searchproducts = await searchProductService.getManySearchProductWithPagination(query, { skip, limit, sort: { created_at: -1 } });
      res.send({
        status: STATUS.SUCCESS,
        message: SEARCHPRODUCT_RESPONSE.GET_MANY_SUCCESS,
        data: searchproducts,
      });
    } catch (err) {
      err.description = SEARCHPRODUCT_RESPONSE.GET_MANY_FAILED;
      next(err);
    }
  },
  editSearchProduct: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      let body:any={}
      let query: IQuerySearchProduct = {
        created_by:req.decoded.id,
      };
      if(req.body.search_product){
        body.$pull={search_product:req.body.search_product}
      }
      const editedsearchProduct = await searchProductService.addSearchProduct(query, body);
      if (editedsearchProduct) {

        const searchproduct = await searchProductService.getSearchProduct(query);
        res.send({
          status: STATUS.SUCCESS,
          message: SEARCHPRODUCT_RESPONSE.EDIT_SUCCESS,
          data: searchproduct,
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: SEARCHPRODUCT_RESPONSE.EDIT_FAILED });
      }
    } catch (err) {
      err.description = SEARCHPRODUCT_RESPONSE.EDIT_FAILED;
      next(err);
    }
  },
  deleteSearchProduct: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const deleteSearchProduct = await searchProductService.deleteSearchProduct({ _id: req.body.searchproduct_id });
      if (deleteSearchProduct) {
        res.send({
          status: STATUS.SUCCESS,
          message: SEARCHPRODUCT_RESPONSE.DELETE_SUCCESS,
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: SEARCHPRODUCT_RESPONSE.DELETE_FAILED });
      }
    } catch (err) {
      err.description = SEARCHPRODUCT_RESPONSE.DELETE_FAILED;
      next(err);
    }
  },
};

export default searchProductController;
