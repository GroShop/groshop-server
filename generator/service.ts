// @ts-nocheck
import _MNS_ from "../models/_MN_.model";
import { ICreate_MNS_, I_MNS_, IEdit_MNS_, IQuery_MNS_, IMongooseUpdate, IPagination_MNS_, IPaginationOption } from "../helpers/interface.helper";

const _MNS_Service = {
  create_MNS_: async (body: ICreate_MNS_): Promise<I_MNS_> => {
    const create_MNS_: I_MNS_ = await _MNS_.create(body);
    return create_MNS_;
  },
  get_MNS_: async (query: IQuery_MNS_): Promise<I_MNS_> => {
    const get_MNS_: I_MNS_ = await _MNS_.findOne(query).lean();
    return get_MNS_;
  },
  getMany_MNS_: async (query: IQuery_MNS_): Promise<I_MNS_[]> => {
    query.is_deleted = false;
    const getMany_MNS_: I_MNS_[] = await _MNS_.find(query).lean();
    return getMany_MNS_;
  },
  getMany_MNS_WithPagination: async (query: IQuery_MNS_, options: IPaginationOption): Promise<IPagination_MNS_> => {
    query.is_deleted = false;
    const totalDocs = await _MNS_.find(query).count();
    const getMany_MNS_: I_MNS_[] = await _MNS_.find(query).skip(options.skip).limit(options.limit).lean();
    const result: IPagination_MNS_ = {
      docs: getMany_MNS_,
      skip: options.skip,
      limit: options.limit,
      totalDocs,
    };
    return result;
  },
  edit_MNS_: async (query: IEdit_MNS_, body: I_MNS_): Promise<boolean> => {
    const edit_MNS_: IMongooseUpdate = await _MNS_.updateOne(query, { $set: body });
    if (edit_MNS_.modifiedCount === 0) {
      return false;
    }
    return true;
  },
  delete_MNS_: async (query: IEdit_MNS_): Promise<boolean> => {
    const edit_MNS_: IMongooseUpdate = await _MNS_.updateOne(query, { $set: { is_deleted: true } });
    if (edit_MNS_.modifiedCount === 0) {
      return false;
    }
    return true;
  },
};

export default _MNS_Service;
