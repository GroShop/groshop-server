
import Product from "../models/product.model";
import { ICreateProduct, IProduct, IPopulatedProduct, IEditProduct, IQueryProduct, IMongooseUpdate, IPaginationProduct,  } from "../helpers/interface.helper";

const ProductService = {
  createProduct: async (body: ICreateProduct): Promise<IProduct> => {
    const product = await Product.create(body);
		const data: IProduct = await Product.findOne({_id: product._id}).lean();
    // if(_.isEmpty(product)){
    //   return false;
    // }
    // return true;
    if(data) {
			data._id = data._id.toString();
		}
		return data;
  },
  getProduct: async (query: IQueryProduct): Promise<IProduct> => {
    query.is_deleted = false;
    const product: IProduct = await Product.findOne(query).lean();
    return product;
  },
  getManyProduct: async (query: IQueryProduct): Promise<IProduct[]> => {
    query.is_deleted = false;
    const products: IProduct[] = await Product.find(query).lean();
    return products;
  },
  getManyProductWithPagination: async (query: IQueryProduct, options: any): Promise<IPaginationProduct> => {
    query.is_deleted = false;
    const totalDocs = await Product.find(query).count();
    const products: IPopulatedProduct[] = await Product.find(query).sort(options.sort).skip(options.skip).limit(options.limit).lean();
    const result: IPaginationProduct = {
      docs: products,
      skip: options.skip,
      limit: options.limit,
      totalDocs,
    };
    return result;
  },
  editProduct: async (query: IQueryProduct, body: IEditProduct): Promise<boolean> => {
    const product: IMongooseUpdate = await Product.updateOne(query, { $set: body });
    if (product.modifiedCount === 0) {
      return false;
    }
    return true;
  },
  deleteProduct: async (query: IQueryProduct): Promise<boolean> => {
    const product: IMongooseUpdate = await Product.updateOne(query, { $set: { is_deleted: true } });
    if (product.modifiedCount === 0) {
      return false;
    }
    return true;
  },
};

export default ProductService;
