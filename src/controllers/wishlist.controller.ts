import wishlistService from "../services/wishlist.service";
import _ from "lodash";
import { STATUS, WISHLIST_RESPONSE } from "../constants/response.constant";
import { IRequest, IResponse, INextFunction, IQuerySearchwishlist, Iwishlist } from "../helpers/interface.helper";
import HTTP from "http-status-codes";

const wishlistController = {
  createWishlist: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      let query: any = {
        created_by: req.decoded.id,
      };
      let getWishlist = await wishlistService.getWishlist(query);
      let wishlist:Iwishlist;
      if (_.isEmpty(getWishlist)) {
        if (!_.isEmpty(req.body.wishlist_product)) {
          query.wishlist_product = [req.body.wishlist_product];
        }
        wishlist = await wishlistService.createWishlist(query);
      } else {
        let editWishlist: boolean;
        if (_.some(getWishlist.wishlist_product, e => e._id.toString() === req.body.wishlist_product)) {
          editWishlist = await wishlistService.editWishlist(query, { $pull: { wishlist_product: req.body.wishlist_product } });
        } else {
          editWishlist = await wishlistService.editWishlist(query, {
            $push: { wishlist_product: { $each: [req.body.wishlist_product], $position: 0 } },
          });
        }
        if (editWishlist) {
          wishlist = await wishlistService.getWishlist(query);
        }
      }
      if (!_.isEmpty(wishlist)) {
        res.send({
          status: STATUS.SUCCESS,
          message: WISHLIST_RESPONSE.CREATE_SUCCESS,
          data: wishlist,
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.SUCCESS, message: WISHLIST_RESPONSE.CREATE_FAILED });
      }
    } catch (err) {
      err.description = WISHLIST_RESPONSE.CREATE_FAILED;
      next(err);
    }
  },
  getWishlist: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const wishlist = await wishlistService.getWishlist({ created_by: req.decoded.id });
      if (!_.isEmpty(wishlist)) {
        res.send({ status: STATUS.SUCCESS, message: WISHLIST_RESPONSE.GET_SUCCESS, data: wishlist });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: WISHLIST_RESPONSE.GET_FAILED });
      }
    } catch (err) {
      err.description = WISHLIST_RESPONSE.GET_FAILED;
      next(err);
    }
  },
  getManyWishlistWithPagination: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const { skip = 0, limit = 10, search } = req.body;
      let query: IQuerySearchwishlist = {};
      if (search && search.length > 0) {
        query = {
          ...query,
          $or: [{ wishlist_product: { $regex: search, $options: "i" } }],
        };
      }
      const wishlists = await wishlistService.getManyWishlistWithPagination(query, { skip, limit, sort: { created_at: -1 } });
      res.send({
        status: STATUS.SUCCESS,
        message: WISHLIST_RESPONSE.GET_MANY_SUCCESS,
        data: wishlists,
      });
    } catch (err) {
      err.description = WISHLIST_RESPONSE.GET_MANY_FAILED;
      next(err);
    }
  },
  getManyWishlist: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const { skip = 0, limit = 10, search } = req.body;
      let query: IQuerySearchwishlist = {
      };
      if (search && search.length > 0) {
        query = {
          ...query,
          $or: [{ wishlist_product: { $regex: search, $options: "i" } }],
        };
      }
      const wishlists = await wishlistService.getManyWishlist(query );
      res.send({
        status: STATUS.SUCCESS,
        message: WISHLIST_RESPONSE.GET_MANY_SUCCESS,
        data: wishlists,
      });
    } catch (err) {
      err.description = WISHLIST_RESPONSE.GET_MANY_FAILED;
      next(err);
    }
  },
  removeWishlist: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      let query: any = {
        created_by: req.decoded.id,
      };
      const removeWishlist = await wishlistService.editWishlist(query, { $pull: { wishlist_product: req.body.wishlist_product } });
      if (removeWishlist) {
        const query = {
          created_by: req.decoded.id,
        };
        const wishlist = await wishlistService.getWishlist(query);
        res.send({
          status: STATUS.SUCCESS,
          message: WISHLIST_RESPONSE.EDIT_SUCCESS,
          data: wishlist,
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: WISHLIST_RESPONSE.EDIT_FAILED });
      }
    } catch (err) {
      err.description = WISHLIST_RESPONSE.EDIT_FAILED;
      next(err);
    }
  },
  editedWishlist: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const { ...body } = req.body;
      const editedWishlist = await wishlistService.editWishlist({ _id: req.body.wishlist_id }, body);
      if (editedWishlist) {
        const query = {
          _id: req.body.wishlist_id,
        };
        const wishlist = await wishlistService.getWishlist(query);
        res.send({
          status: STATUS.SUCCESS,
          message: WISHLIST_RESPONSE.EDIT_SUCCESS,
          data: wishlist,
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: WISHLIST_RESPONSE.EDIT_FAILED });
      }
    } catch (err) {
      err.description = WISHLIST_RESPONSE.EDIT_FAILED;
      next(err);
    }
  },

  deleteWishlist: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const deleteWishlist = await wishlistService.deleteWishlist({ _id: req.body.wishlist_id });
      if (deleteWishlist) {
        res.send({
          status: STATUS.SUCCESS,
          message: WISHLIST_RESPONSE.DELETE_SUCCESS,
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: WISHLIST_RESPONSE.DELETE_FAILED });
      }
    } catch (err) {
      err.description = WISHLIST_RESPONSE.DELETE_FAILED;
      next(err);
    }
  },
};

export default wishlistController;
