import express from "express";
import http from "http";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import fileUpload from "express-fileupload";
import { Server } from "socket.io";
import connectDB from "./db";

import userRoute from "./routes/v1/user.route";
import productRoute from "./routes/v1/product.route";
import searchProductRoute from "./routes/v1/search_product.route";
import wishlistRoute from "./routes/v1/wishlist.route";
import CartRoute from "./routes/v1/cart.route";
import VoucherRoute from "./routes/v1/voucher.route";
import BookingRoute from "./routes/v1/booking.route";
import { bookingCron } from "./helpers/cron.helper";
//_NR_

// create server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

function assignId(req, res, next) {
  req.id = nanoid(10);
  next();
}

// config dotenv
dotenv.config();

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('senderMessage',(item:any)=>{
// if(i)
//     if()
//     console.log('payload',payload);
//   io.emit('senderMessage', payload);

  
  })
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
// connect mongoose
if (process.env.NODE_ENV === "test") {
  process.env.DB = process.env.TEST_DB;
}
connectDB();

bookingCron();

app.set("view engine", "ejs");

//BodyParser
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// set mongoose as global
mongoose.Promise = global.Promise;

//To enable Cross-Origin Resource Sharing
let domain = "*";
if (process.env.NODE_ENV === "dev") {
  domain = "*";
}
app.use(
  cors({
    origin: domain,
  })
);

// fileUpload
app.use(fileUpload());

// routes
app.use("/api/v1/auth", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/search_product", searchProductRoute);
app.use("/api/v1/wishlist", wishlistRoute);
app.use("/api/v1/cart", CartRoute);
app.use("/api/v1/voucher", VoucherRoute);
app.use("/api/v1/booking", BookingRoute);
//_NRD_

//Error Handling
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV === "production") {
    res.status(500).send({ desc: err.desc || "Something Went Wrong" });
    console.error(err);
  } else {
    console.error(err);
    res.status(500).send({ desc: err.desc, stack: err.stack, message: err.message });
  }
});

export default server;
