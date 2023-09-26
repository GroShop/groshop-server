
import Message from "../models/message.model";
import { ICreateMessage, IMessage, IPopulatedMessage, IEditMessage, IQueryMessage, IPaginationMessage, IPaginationOption } from "../helpers/interface.helper";
import Populate from "../constants/populate.constant";

const MessageService = {
  createMessage: async (body: ICreateMessage): Promise<IMessage> => {
    const message = await Message.create(body);
		const data: IMessage = await Message.findOne({_id: message._id}).lean();
    // if(_.isEmpty(message)){
    //   return false;
    // }
    // return true;
    if(data) {
			data._id = data._id.toString();
		}
		return data;
  },
  getMessage: async (query: IQueryMessage): Promise<IMessage> => {
    query.is_deleted = false;
    const message: IMessage = await Message.findOne(query).populate(Populate.message).lean();
    return message;
  },
  getManyMessage: async (query: IQueryMessage): Promise<IMessage[]> => {
    query.is_deleted = false;
    const messages: IMessage[] = await Message.find(query).populate(Populate.message).lean();
    return messages;
  },
  getManyMessageWithPagination: async (query: IQueryMessage, options: IPaginationOption): Promise<IPaginationMessage> => {
    query.is_deleted = false;
    const totalDocs = await Message.find(query).count();
    const messages: IPopulatedMessage[] = await Message.find(query).sort(options.sort).skip(options.skip).limit(options.limit).lean();
    const result: IPaginationMessage = {
      docs: messages,
      skip: options.skip,
      limit: options.limit,
      totalDocs,
    };
    return result;
  },
  editMessage: async (query: IQueryMessage, body: IEditMessage): Promise<boolean> => {
    const message = await Message.updateOne(query, { $set: body });
    if (message.modifiedCount === 0) {
      return false;
    }
    return true;
  },
  deleteMessage: async (query: IQueryMessage): Promise<boolean> => {
    const message = await Message.updateOne(query, { $set: { is_deleted: true } });
    if (message.modifiedCount === 0) {
      return false;
    }
    return true;
  },
};

export default MessageService;
