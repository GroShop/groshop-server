import moment from 'moment';
import  cron  from 'node-cron';
import BookingService from '../services/booking.service';
import { BOOKING } from '../constants/cart.constant';


export const bookingCron = () => {
  cron.schedule(`0 * * * *`, async () => {
    try {
      let currentDate = moment();
      let processing = currentDate.subtract(2, "hours").toDate();
      let dispatch = currentDate.subtract(4, "hours").toDate();
      let delivered = currentDate.subtract(8, "hours").toDate();
      let query = {
        created_at: { $gte: processing },
        status: BOOKING.ORDERED_PLACED,
      };
      await BookingService.bookingStatus(query);
      query = {
        created_at: { $gte: dispatch },
        status: BOOKING.DISPATCH,
      };
      await BookingService.bookingStatus(query);
      query = {
        created_at: { $gte: delivered },
        status: BOOKING.DISPATCH,
      };
      await BookingService.bookingStatus(query);
    } catch (error) {}
  });
};