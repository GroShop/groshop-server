
import Booking from "../models/booking.model";
import { ICreateBooking, IBooking, IPopulatedBooking, IEditBooking, IQueryBooking, IMongooseUpdate, IPaginationBooking,  } from "../helpers/interface.helper";
import Razorpay from "razorpay";
var instance = new Razorpay({ key_id: `rzp_test_5E9saBhBEvuN7m`, key_secret:'b0UaKZZrVE2EjquwyzTGy2FE'})
const RazorPayService = {
  createOrder: async (body: any) => {
    const createOrder = await instance.orders.create(body); 
		return createOrder;
  },
  getPayment: async (query: any) => {
    const getPayment: any = await instance.payments.fetch(query)
    return getPayment;
  },
  getManyBooking: async (query: IQueryBooking): Promise<IBooking[]> => {
    query.is_deleted = false;
    const bookings: IBooking[] = await Booking.find(query).lean();
    return bookings;
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
};

export default RazorPayService;
