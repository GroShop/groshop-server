import VoucherService from "../services/voucher.service";
import _ from "lodash";
import { STATUS, VOUCHER_RESPONSE } from "../constants/response.constant";
import { IRequest, IResponse, INextFunction, IQuerySearchVoucher } from "../helpers/interface.helper";
import HTTP from "http-status-codes";

const VoucherController = {
  createVoucher: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const query = {
        created_by: req.decoded.id,
        ...req.body,
      };
      const voucher = await VoucherService.createVoucher(query);
      if (voucher) {
        res.send({
          status: STATUS.SUCCESS,
          message: VOUCHER_RESPONSE.CREATE_SUCCESS,
          data: voucher,
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.SUCCESS, message: VOUCHER_RESPONSE.CREATE_FAILED });
      }
    } catch (err) {
      err.description = VOUCHER_RESPONSE.CREATE_FAILED;
      next(err);
    }
  },
  getVoucher: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const voucher = await VoucherService.getVoucher({ _id: req.body.voucher_id });
      if (!_.isEmpty(voucher)) {
        res.send({ status: STATUS.SUCCESS, message: VOUCHER_RESPONSE.GET_SUCCESS, data: voucher });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: VOUCHER_RESPONSE.GET_FAILED });
      }
    } catch (err) {
      err.description = VOUCHER_RESPONSE.GET_FAILED;
      next(err);
    }
  },
  getManyVoucher: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const { skip = 0, limit = 10, search } = req.body;
      let query: IQuerySearchVoucher = {};
      if (search && search.length > 0) {
        query = {
          ...query,
          $or: [{ name: { $regex: search, $options: "i" } }, { discount: { $regex: search, $options: "i" } }],
        };
      }
      const vouchers = await VoucherService.getManyVoucher(query);
      res.send({
        status: STATUS.SUCCESS,
        message: VOUCHER_RESPONSE.GET_MANY_SUCCESS,
        data: vouchers,
      });
    } catch (err) {
      err.description = VOUCHER_RESPONSE.GET_MANY_FAILED;
      next(err);
    }
  },

  getManyVoucherWithPagination: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const { skip = 0, limit = 10, search } = req.body;
      let query: IQuerySearchVoucher = {};
      if (search && search.length > 0) {
        query = {
          ...query,
          $or: [{ name: { $regex: search, $options: "i" } }, { discount: { $regex: search, $options: "i" } }],
        };
      }
      const vouchers = await VoucherService.getManyVoucherWithPagination(query, { skip, limit, sort: { created_at: -1 } });
      res.send({
        status: STATUS.SUCCESS,
        message: VOUCHER_RESPONSE.GET_MANY_SUCCESS,
        data: vouchers,
      });
    } catch (err) {
      err.description = VOUCHER_RESPONSE.GET_MANY_FAILED;
      next(err);
    }
  },
  editVoucher: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const { ...body } = req.body;
      const editedVoucher = await VoucherService.editVoucher({ _id: req.body.voucher_id }, body);
      if (editedVoucher) {
        const query = {
          _id: req.body.voucher_id,
        };
        const voucher = await VoucherService.getVoucher(query);
        res.send({
          status: STATUS.SUCCESS,
          message: VOUCHER_RESPONSE.EDIT_SUCCESS,
          data: voucher,
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: VOUCHER_RESPONSE.EDIT_FAILED });
      }
    } catch (err) {
      err.description = VOUCHER_RESPONSE.EDIT_FAILED;
      next(err);
    }
  },
  deleteVoucher: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const deleteVoucher = await VoucherService.deleteVoucher({ _id: req.body.voucher_id });
      if (deleteVoucher) {
        res.send({
          status: STATUS.SUCCESS,
          message: VOUCHER_RESPONSE.DELETE_SUCCESS,
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: VOUCHER_RESPONSE.DELETE_FAILED });
      }
    } catch (err) {
      err.description = VOUCHER_RESPONSE.DELETE_FAILED;
      next(err);
    }
  },
};

export default VoucherController;
