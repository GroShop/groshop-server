// @ts-nocheck
import _MN_Service from "../services/_MN_.service";
import _ from "lodash";
import { STATUS, _MNC__RESPONSE } from "../constants/response.constant";
import { IRequest, IResponse, INextFunction } from "../helpers/interface.helper";
import HTTP from "http-status-codes";

const _MN_Controller = {
  create_MNS_: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const create_MNS_ = await _MN_Service.create_MNS_(req.body);
      if (create_MNS_) {
        res.send({
          status: STATUS.SUCCESS,
          message: _MNC__RESPONSE.CREATE_SUCCESS,
          data: create_MNS_,
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.SUCCESS, message: _MNC__RESPONSE.CREATE_FAILED });
      }
    } catch (err) {
      err.description = _MNC__RESPONSE.CREATE_FAILED;
      next(err);
    }
  },
  get_MNS_: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const { _MN__id } = req.body;
      const get_MNS_ = await _MN_Service.get_MNS_({ _id: _MN__id });
      if (!_.isEmpty(get_MNS_)) {
        res.send({ status: STATUS.SUCCESS, message: _MNC__RESPONSE.GET_SUCCESS, data: get_MNS_ });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: _MNC__RESPONSE.GET_FAILED });
      }
    } catch (err) {
      err.description = _MNC__RESPONSE.GET_FAILED;
      next(err);
    }
  },
  getMany_MNS_: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const { skip = 0, limit = 10, search } = req.body;
      let query: any = {
        user: req.decoded.id,
      };
      if (search && search.length > 0) {
        query = {
          ...query,
          $or: [_MSEARCH_],
        };
      }
      const getMany_MNS_ = await _MN_Service.getMany_MNS_WithPagination(query, { skip, limit });
      res.send({
        status: STATUS.SUCCESS,
        message: _MNC__RESPONSE.GET_MANY_SUCCESS,
        data: getMany_MNS_,
      });
    } catch (err) {
      err.description = _MNC__RESPONSE.GET_MANY_FAILED;
      next(err);
    }
  },
  edit_MNS_: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const { _MN__id, ...body } = req.body;
      const edit_MNS_ = await _MN_Service.edit_MNS_({ _id: _MN__id }, body);
      if (edit_MNS_) {
        const query = {
          _id: _MN__id,
        };
        const get_MNS_ = await _MN_Service.get_MNS_(query);
        res.send({
          status: STATUS.SUCCESS,
          message: _MNC__RESPONSE.EDIT_SUCCESS,
          data: get_MNS_,
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: _MNC__RESPONSE.EDIT_FAILED });
      }
    } catch (err) {
      err.description = _MNC__RESPONSE.EDIT_FAILED;
      next(err);
    }
  },
  delete_MNS_: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const { _MN__id } = req.body;
      const delete_MNS_ = await _MN_Service.delete_MNS_({ _id: _MN__id });
      if (delete_MNS_) {
        res.send({
          status: STATUS.SUCCESS,
          message: _MNC__RESPONSE.DELETE_SUCCESS,
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: _MNC__RESPONSE.DELETE_FAILED });
      }
    } catch (err) {
      err.description = _MNC__RESPONSE.DELETE_FAILED;
      next(err);
    }
  },
};

export default _MN_Controller;
