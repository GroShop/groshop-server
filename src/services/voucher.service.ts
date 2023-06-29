
import Voucher from "../models/voucher.model";
import { ICreateVoucher, IVoucher, IPopulatedVoucher, IEditVoucher, IQueryVoucher, IMongooseUpdate, IPaginationVoucher, IPaginationOption } from "../helpers/interface.helper";

const VoucherService = {
  createVoucher: async (body: ICreateVoucher): Promise<IVoucher> => {
    const voucher = await Voucher.create(body);
		const data: IVoucher = await Voucher.findOne({_id: voucher._id}).lean();
    // if(_.isEmpty(voucher)){
    //   return false;
    // }
    // return true;
    if(data) {
			data._id = data._id.toString();
		}
		return data;
  },
  getVoucher: async (query: IQueryVoucher): Promise<IVoucher> => {
    query.is_deleted = false;
    const voucher: IVoucher = await Voucher.findOne(query).lean();
    return voucher;
  },
  getManyVoucher: async (query: IQueryVoucher): Promise<IVoucher[]> => {
    query.is_deleted = false;
    const vouchers: IVoucher[] = await Voucher.find(query).lean();
    return vouchers;
  },
  getManyVoucherWithPagination: async (query: IQueryVoucher, options: IPaginationOption): Promise<IPaginationVoucher> => {
    query.is_deleted = false;
    const totalDocs = await Voucher.find(query).count();
    const vouchers: IPopulatedVoucher[] = await Voucher.find(query).sort(options.sort).skip(options.skip).limit(options.limit).lean();
    const result: IPaginationVoucher = {
      docs: vouchers,
      skip: options.skip,
      limit: options.limit,
      totalDocs,
    };
    return result;
  },
  editVoucher: async (query: IQueryVoucher, body: IEditVoucher): Promise<boolean> => {
    const voucher: IMongooseUpdate = await Voucher.updateOne(query, { $set: body });
    if (voucher.modifiedCount === 0) {
      return false;
    }
    return true;
  },
  deleteVoucher: async (query: IQueryVoucher): Promise<boolean> => {
    const voucher: IMongooseUpdate = await Voucher.updateOne(query, { $set: { is_deleted: true } });
    if (voucher.modifiedCount === 0) {
      return false;
    }
    return true;
  },
};

export default VoucherService;
