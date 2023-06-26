
import Cart from "../models/cart.model";
import { ICreateCart, ICart, IPopulatedCart, IEditCart, IQueryCart, IMongooseUpdate, IPaginationCart, IPaginationOption } from "../helpers/interface.helper";
import Populate from "../constants/populate.constant";

const CartService = {
  createCart: async (body: ICreateCart): Promise<ICart> => {
    const cart = await Cart.create(body);
		// const data: ICart = await Cart.findOne({_id: cart._id}).lean();
    // if(_.isEmpty(cart)){
    //   return false;
    // }
    // return true;
    // if(data) {
		// 	data._id = data._id.toString();
		// }
		return cart;
  },
  getCart: async (query: IQueryCart): Promise<ICart> => {
    query.is_deleted = false;
    const cart: ICart = await Cart.findOne(query).lean();
    return cart;
  },
  getManyCart: async (query: IQueryCart): Promise<ICart[]> => {
    query.is_deleted = false;
    const carts: ICart[] = await Cart.find(query).populate(Populate.cart).lean();
    return carts;
  },
  getManyCartWithPagination: async (query: IQueryCart, options: IPaginationOption): Promise<IPaginationCart> => {
    query.is_deleted = false;
    const totalDocs = await Cart.find(query).count();
    const carts: IPopulatedCart[] = await Cart.find(query).sort(options.sort).skip(options.skip).limit(options.limit).lean();
    const result: IPaginationCart = {
      docs: carts,
      skip: options.skip,
      limit: options.limit,
      totalDocs,
    };
    return result;
  },
  editCart: async (query: IQueryCart, body: IEditCart): Promise<boolean> => {
    const cart: IMongooseUpdate = await Cart.updateOne(query, { $set: body });
    if (cart.modifiedCount === 0) {
      return false;
    }
    return true;
  },
  deleteCart: async (query: IQueryCart): Promise<boolean> => {
    const cart: IMongooseUpdate = await Cart.updateOne(query, { $set: { is_deleted: true } });
    if (cart.modifiedCount === 0) {
      return false;
    }
    return true;
  },
};

export default CartService;
