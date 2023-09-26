
import ChatService from "../services/chat.service";
import _ from "lodash";
import { STATUS, CHAT_RESPONSE } from "../constants/response.constant";
import { IRequest, IResponse, INextFunction, IQuerySearchChat } from "../helpers/interface.helper";
import HTTP from "http-status-codes";

const ChatController = {
  createChat: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const getChat = await ChatService.getChat({  });
  if(getChat) return res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: CHAT_RESPONSE.ALREADY_EXIST });
      const chat = await ChatService.createChat(req.body);
      if (chat) {
        res.send({
          status: STATUS.SUCCESS,
          message: CHAT_RESPONSE.CREATE_SUCCESS,
          data: chat
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.SUCCESS, message: CHAT_RESPONSE.CREATE_FAILED });
      }
    } catch (err) {
      err.description = CHAT_RESPONSE.CREATE_FAILED;
      next(err);
    }
  },
  getChat: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const chat = await ChatService.getChat({ _id: req.body.chat_id });
      if (!_.isEmpty(chat)) {
        res.send({ status: STATUS.SUCCESS, message: CHAT_RESPONSE.GET_SUCCESS, data: chat });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: CHAT_RESPONSE.GET_FAILED });
      }
    } catch (err) {
      err.description = CHAT_RESPONSE.GET_FAILED;
      next(err);
    }
  },
  getManyChat: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const { skip = 0, limit = 10, search } = req.body;
      let query: IQuerySearchChat = {};
      if (search && search.length > 0) {
        query = {
          ...query,
          $or: [{ isAdmin: { $regex: search, $options: "i" } },
{ groupChat: { $regex: search, $options: "i" } },
],
        };
      }
      const chats = await ChatService.getManyChatWithPagination(query, { skip, limit, sort: { created_at: -1} });
      res.send({
        status: STATUS.SUCCESS,
        message: CHAT_RESPONSE.GET_MANY_SUCCESS,
        data: chats,
      });
    } catch (err) {
      err.description = CHAT_RESPONSE.GET_MANY_FAILED;
      next(err);
    }
  },
  editChat: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const { ...body } = req.body;
      const editedChat = await ChatService.editChat({ _id: req.body.chat_id }, body);
      if (editedChat) {
        const query = {
          _id: req.body.chat_id,
        };
        const chat = await ChatService.getChat(query);
        res.send({
          status: STATUS.SUCCESS,
          message: CHAT_RESPONSE.EDIT_SUCCESS,
          data: chat,
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: CHAT_RESPONSE.EDIT_FAILED });
      }
    } catch (err) {
      err.description = CHAT_RESPONSE.EDIT_FAILED;
      next(err);
    }
  },
  deleteChat: async (req: IRequest, res: IResponse, next: INextFunction) => {
    try {
      const deleteChat = await ChatService.deleteChat({ _id: req.body.chat_id });
      if (deleteChat) {
        res.send({
          status: STATUS.SUCCESS,
          message: CHAT_RESPONSE.DELETE_SUCCESS,
        });
      } else {
        res.status(HTTP.UNPROCESSABLE_ENTITY).send({ status: STATUS.FAILED, message: CHAT_RESPONSE.DELETE_FAILED });
      }
    } catch (err) {
      err.description = CHAT_RESPONSE.DELETE_FAILED;
      next(err);
    }
  },
};

export default ChatController;
