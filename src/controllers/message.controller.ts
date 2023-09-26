
import MessageService from "../services/message.service";
import _ from "lodash";
import { STATUS, MESSAGE_RESPONSE } from "../constants/response.constant";
import { IRequest, IResponse, INextFunction, IQuerySearchMessage } from "../helpers/interface.helper";
import HTTP from "http-status-codes";
import ChatService from "../services/chat.service";

const MessageController = {
  createMessage: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const message = await MessageService.createMessage(req.body);
      await ChatService.editChat({_id:req.body.chat_id},{lastMessage:message._id})
      const getMessage = await MessageService.getMessage({_id:message._id})
      if (!_.isEmpty(getMessage)) {
        res.send({
          status: STATUS.SUCCESS,
          message: MESSAGE_RESPONSE.CREATE_SUCCESS,
          data: getMessage
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.SUCCESS, message: MESSAGE_RESPONSE.CREATE_FAILED });
      }
    } catch (err) {
      err.description = MESSAGE_RESPONSE.CREATE_FAILED;
      next(err);
    }
  },
  getMessage: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const message = await MessageService.getMessage({ _id: req.body.message_id });
      if (!_.isEmpty(message)) {
        res.send({ status: STATUS.SUCCESS, message: MESSAGE_RESPONSE.GET_SUCCESS, data: message });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: MESSAGE_RESPONSE.GET_FAILED });
      }
    } catch (err) {
      err.description = MESSAGE_RESPONSE.GET_FAILED;
      next(err);
    }
  },
  getManyMessage: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const { skip = 0, limit = 10, search } = req.body;
      let query: IQuerySearchMessage = {};
      if (search && search.length > 0) {
        query = {
          ...query,
          $or: [{ cart: { $regex: search, $options: "i" } },
{ sender: { $regex: search, $options: "i" } },
{ content: { $regex: search, $options: "i" } },
],
        };
      }
      const messages = await MessageService.getManyMessageWithPagination(query, { skip, limit, sort: { created_at: -1} });
      res.send({
        status: STATUS.SUCCESS,
        message: MESSAGE_RESPONSE.GET_MANY_SUCCESS,
        data: messages,
      });
    } catch (err) {
      err.description = MESSAGE_RESPONSE.GET_MANY_FAILED;
      next(err);
    }
  },
  editMessage: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const { ...body } = req.body;
      const editedMessage = await MessageService.editMessage({ _id: req.body.message_id }, body);
      if (editedMessage) {
        const query = {
          _id: req.body.message_id,
        };
        const message = await MessageService.getMessage(query);
        res.send({
          status: STATUS.SUCCESS,
          message: MESSAGE_RESPONSE.EDIT_SUCCESS,
          data: message,
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: MESSAGE_RESPONSE.EDIT_FAILED });
      }
    } catch (err) {
      err.description = MESSAGE_RESPONSE.EDIT_FAILED;
      next(err);
    }
  },
  deleteMessage: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const deleteMessage = await MessageService.deleteMessage({ _id: req.body.message_id });
      if (deleteMessage) {
        res.send({
          status: STATUS.SUCCESS,
          message: MESSAGE_RESPONSE.DELETE_SUCCESS,
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: MESSAGE_RESPONSE.DELETE_FAILED });
      }
    } catch (err) {
      err.description = MESSAGE_RESPONSE.DELETE_FAILED;
      next(err);
    }
  },
};

export default MessageController;
