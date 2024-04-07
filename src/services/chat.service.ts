
import Chat from "../models/chat.model";
import { ICreateChat, IChat, IPopulatedChat, IEditChat, IQueryChat, IPaginationChat, IPaginationOption } from "../helpers/interface.helper";
import Populate from "../constants/populate.constant";

const ChatService = {
  createChat: async (body: ICreateChat): Promise<IChat> => {
    const chat = await Chat.create(body);
		const data: IChat = await Chat.findOne({_id: chat._id}).lean();
    // if(_.isEmpty(chat)){
    //   return false;
    // }
    // return true;
    if(data) {
			data._id = data._id.toString();
		}
		return data;
  },
  getChat: async (query: IQueryChat): Promise<IChat> => {
    query.is_deleted = false;
    const chat: IChat = await Chat.findOne(query).lean();
    return chat;
  },
  getManyChat: async (query: IQueryChat): Promise<IChat[]> => {
    query.is_deleted = false;
    const chats: IChat[] = await Chat.find(query).lean();
    return chats;
  },
  getManyChatWithPagination: async (query: IQueryChat, options: IPaginationOption): Promise<IPaginationChat> => {
    query.is_deleted = false;
    const totalDocs = await Chat.find(query).count();
    const chats: IPopulatedChat[] = await Chat.find(query).populate(Populate.chat).sort(options.sort).skip(options.skip).limit(options.limit).lean();
    const result: IPaginationChat = {
      docs: chats,
      skip: options.skip,
      limit: options.limit,
      totalDocs,
    };
    return result;
  },
  editChat: async (query: IQueryChat, body: IEditChat): Promise<boolean> => {
    const chat = await Chat.updateOne(query, { $set: body });
    if (chat.modifiedCount === 0) {
      return false;
    }
    return true;
  },
  deleteChat: async (query: IQueryChat): Promise<boolean> => {
    const chat = await Chat.updateOne(query, { $set: { is_deleted: true } });
    if (chat.modifiedCount === 0) {
      return false;
    }
    return true;
  },
};

export default ChatService;
