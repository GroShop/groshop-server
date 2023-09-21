import moment from 'moment';
import  cron  from 'node-cron';
import BookingService from '../services/booking.service';
import { BOOKING } from '../constants/cart.constant';


export const bookingCron = () => {
  cron.schedule(`0 * * * *`, async () => {
    try {
      let currentDate = moment();
      let processing = currentDate.subtract(2, "hours").toDate();
      console.log('processing',processing);
      let dispatch = currentDate.subtract(4, "hours").toDate();
      let delivered = currentDate.subtract(8, "hours").toDate();
      let query = {
        created_at: { $lte: processing },
        status: BOOKING.ORDERED_PLACED,
      };
      await BookingService.bookingStatus(query);
      query = {
        created_at: { $lte: dispatch },
        status: BOOKING.PROCESSING,
      };
      await BookingService.bookingStatus(query);
      query = {
        created_at: { $lte: delivered },
        status: BOOKING.DISPATCH,
      };
      await BookingService.bookingStatus(query);
    } catch (error) {
      console.log('error',error);
      
     }
  });
};