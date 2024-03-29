import Booking from "../models/booking.model";
import {
  ICreateBooking,
  IBooking,
  IPopulatedBooking,
  IEditBooking,
  IQueryBooking,
  IMongooseUpdate,
  IPaginationBooking,
} from "../helpers/interface.helper";
import _ from "lodash";
import { BOOKING } from "../constants/cart.constant";
import Populate from "../constants/populate.constant";

const BookingService = {
  createBooking: async (body: ICreateBooking): Promise<IBooking> => {
    const booking = await Booking.create(body);
    const data: IBooking = await Booking.findOne({ _id: booking._id }).lean();
    // if(_.isEmpty(booking)){
    //   return false;
    // }
    // return true;
    if (data) {
      data._id = data._id.toString();
    }
    return data;
  },
  getBooking: async (query: IQueryBooking): Promise<IBooking> => {
    query.is_deleted = false;
    const booking: IBooking = await Booking.findOne(query).populate(Populate.booking).lean();
    return booking;
  },
  getManyBooking: async (query: IQueryBooking,options:any): Promise<IBooking[]> => {
    query.is_deleted = false;
    const bookings: IBooking[] = await Booking.find(query).sort(options.sort).populate(Populate.booking).lean();
    return bookings;
  },
  getManyBookingWithPagination: async (query: IQueryBooking, options: any): Promise<IPaginationBooking> => {
    query.is_deleted = false;
    const totalDocs = await Booking.find(query).count();
    const bookings: IPopulatedBooking[] = await Booking.find(query).sort(options.sort).skip(options.skip).limit(options.limit).lean();
    const result: IPaginationBooking = {
      docs: bookings,
      skip: options.skip,
      limit: options.limit,
      totalDocs,
    };
    return result;
  },
  editBooking: async (query: IQueryBooking, body: IEditBooking): Promise<boolean> => {
    const booking: IMongooseUpdate = await Booking.updateOne(query, { $set: body });
    if (booking.modifiedCount === 0) {
      return false;
    }
    return true;
  },
  deleteBooking: async (query: IQueryBooking): Promise<boolean> => {
    const booking: IMongooseUpdate = await Booking.updateOne(query, { $set: { is_deleted: true } });
    if (booking.modifiedCount === 0) {
      return false;
    }
    return true;
  },
  bookingStatus: async query => {
    const getBooking:any = await Booking.find(query).lean();
    if (!_.isEmpty(getBooking)) {
      for (let data of getBooking) {
      let track=data.tracking_status
      delete query.created_at;
      if (query.status === BOOKING.ORDERED_PLACED) {
        query.status = BOOKING.PROCESSING;
        track.push({
          status: BOOKING.PROCESSING,
          created_at:new Date()
        })
        query.tracking_status=track
      } else if (query.status === BOOKING.PROCESSING) {
        query.status = BOOKING.DISPATCH;
        track.push({
          status:  BOOKING.DISPATCH,
          created_at:new Date()
        })
        query.tracking_status=track
      } else if (query.status === BOOKING.DISPATCH) {
        query.status = BOOKING.DELIVERED;
        track.push({
          status: BOOKING.DELIVERED,
          created_at:new Date()
        })
        query.tracking_status=track
      }
        await Booking.updateOne({ _id: data._id }, { $set: query });
      }
    }
    return;
  },
};

export default BookingService;
