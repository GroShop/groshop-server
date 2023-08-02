import wishlist from "../models/wishlist.model";
import {
  ICreatewishlist,
  Iwishlist,
  IPopulatedwishlist,
  IEditwishlist,
  IQuerywishlist,
  IMongooseUpdate,
  IPaginationwishlist,
} from "../helpers/interface.helper";
import Populate from "../constants/populate.constant";

const wishlistService = {
  createWishlist: async (body: ICreatewishlist): Promise<Iwishlist> => {
    const createWishlist = await wishlist.create(body);
    // const data: Iwishlist = await createWishlist.findOne({ _id: createWishlist._id }).lean();
    // if(_.isEmpty(wishlist)){
    //   return false;
    // }
    // return true;
    // if (data) {
    //   data._id = data._id.toString();
    // }
    return createWishlist;
  },
  getWishlist: async (body: IQuerywishlist): Promise<Iwishlist> => {
    body.is_deleted = false;
    const getWishlist: Iwishlist = await wishlist.findOne(body).populate(Populate.wishlist).lean();
    return getWishlist;
  },
  getManyWishlist: async (query: IQuerywishlist): Promise<Iwishlist[]> => {
    query.is_deleted = false;
    const wishlists: Iwishlist[] = await wishlist.find(query).lean();
    return wishlists;
  },  
  getManyWishlistWithPagination: async (query: IQuerywishlist, options: any): Promise<IPaginationwishlist> => {
    query.is_deleted = false;
    const totalDocs = await wishlist.find(query).count();
    const wishlists: IPopulatedwishlist[] = await wishlist.find(query).sort(options.sort).skip(options.skip).limit(options.limit).lean();
    const result: IPaginationwishlist = {
      docs: wishlists,
      skip: options.skip,
      limit: options.limit,
      totalDocs,
    };
    return result;
  },
  editWishlist: async (query: IQuerywishlist, body: any): Promise<boolean> => {
    const editWishlist: IMongooseUpdate = await wishlist.updateOne(query, body,{ new: true 
    });
    if (editWishlist.modifiedCount === 0) {
      return false;
    }
    return true;
  },
  deleteWishlist: async (query: IQuerywishlist): Promise<boolean> => {
    const deleteWishlist: IMongooseUpdate = await wishlist.updateOne(query, { $set: { is_deleted: true } });
    if (deleteWishlist.modifiedCount === 0) {
      return false;
    }
    return true;
  },
};

export default wishlistService;
