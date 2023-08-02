import searchProduct from "../models/search_product.model";
import {
  ICreateSearchProduct,
  ISearchProduct,
  IPopulatedSearchProduct,
  IEditSearchProduct,
  IQuerySearchProduct,
  IMongooseUpdate,
  IPaginationSearchProduct,
} from "../helpers/interface.helper";
import Populate from "../constants/populate.constant";

const searchProductService = {
  createSearchProduct: async (body: any): Promise<ISearchProduct> => {
    const searchproduct = await searchProduct.create(body);
    const data: ISearchProduct = await searchProduct.findOne({ _id: searchproduct._id }).lean();
    // if(_.isEmpty(searchproduct)){
    //   return false;
    // }
    // return true;
    if (data) {
      data._id = data._id.toString();
    }
    return data;
  },
  getSearchProduct: async (query: IQuerySearchProduct): Promise<ISearchProduct> => {
    query.is_deleted = false;
    const searchproduct: ISearchProduct = await searchProduct.findOne(query).populate(Populate.product).lean();
    return searchproduct;
  },
  getManySearchProduct: async (query: IQuerySearchProduct): Promise<ISearchProduct[]> => {
    query.is_deleted = false;
    const searchproducts: any = await searchProduct.find(query).populate(Populate.product).lean();
    return searchproducts;
  },
  getManySearchProductWithPagination: async (query: IQuerySearchProduct, options: any): Promise<IPaginationSearchProduct> => {
    query.is_deleted = false;
    const totalDocs = await searchProduct.find(query).count();
    const searchproducts: IPopulatedSearchProduct[] = await searchProduct
      .find(query)
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit)
      .lean();
    const result: IPaginationSearchProduct = {
      docs: searchproducts,
      skip: options.skip,
      limit: options.limit,
      totalDocs,
    };
    return result;
  },
  editSearchProduct: async (query: IQuerySearchProduct, body: any): Promise<boolean> => {
    const searchproduct: IMongooseUpdate = await searchProduct.updateOne(query, { $set: body });
    if (searchproduct.modifiedCount === 0) {
      return false;
    }
    return true;
  },
  addSearchProduct: async (query: IQuerySearchProduct, body: any): Promise<boolean> => {
    const searchproduct: IMongooseUpdate = await searchProduct.updateOne(query, body,{ new: true });
    if (searchproduct.modifiedCount === 0) {
      return false;
    }
    return true;
  },
  deleteSearchProduct: async (query: IQuerySearchProduct): Promise<boolean> => {
    const searchproduct: IMongooseUpdate = await searchProduct.updateOne(query, { $set: { is_deleted: true } });
    if (searchproduct.modifiedCount === 0) {
      return false;
    }
    return true;
  },
};

export default searchProductService;
