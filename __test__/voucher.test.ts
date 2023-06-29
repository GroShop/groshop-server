
/* eslint-disable @typescript-eslint/no-explicit-any */
process.env.NODE_ENV = "test";
import User from "../src/models/user.model";
import Voucher from "../src/models/voucher.model";
import mongoose from "mongoose";
import toBeType from "jest-tobetype";
import request from "supertest";
import app from "../src/app";

expect.extend(toBeType);

let token, voucherId;

afterAll(async () => {
  await User.deleteMany({});
  await Voucher.deleteMany({});
  await mongoose.disconnect();
});

describe("Voucher Test", () => {
  test("User signup", async () => {
    const body = {
      email: "kishore@yopmail.com",
      password: "qazwsx12",
    };
    const response: any = await request(app).post("/api/v1/auth/user_signup").send(body);
    expect(response.statusCode).toBe(200);
  });
  test("User login", async () => {
    const body = {
      email: "kishore@yopmail.com",
      password: "qazwsx12",
    };
    const response: any = await request(app).post("/api/v1/auth/user_login").send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe("string");
    token = response.body.token;
  });

  test("Create Voucher", async () => {
    const body: any = {
      name: "qwertyuiop",
discount: 1234567890,
expire_voucher: "Thu Jun 29 2023 11:09:33 GMT+0530 (India Standard Time)",
user: "623980a44794ef59b9024c15",
created_by: "623980a44794ef59b9024c15",

    };
    const response: any = await request(app).post("/api/v1/voucher/create_voucher").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(typeof response.body.data).toBe("object");
    expect(response.body.data).toHaveProperty("_id");
    voucherId = response.body.data._id;
  });

  test("Get Voucher", async () => {
    const body: any = {
      voucher_id: voucherId
    };
    const response: any = await request(app).post("/api/v1/voucher/get_voucher").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(typeof response.body.data).toBe("object");
    expect(response.body.data).toHaveProperty("_id");
  });

  test("Get Many Voucher", async () => {
    const body: any = {
      search: "qwertyuiop",
    };
    const response: any = await request(app).post("/api/v1/voucher/get_many_voucher").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(typeof response.body.data.docs).toBe("object");
    expect(response.body.data.docs[0]).toHaveProperty("_id");
  });

  test("Edit Voucher", async () => {
    const body: any = {
      voucher_id: voucherId,
      name: "qwertyuiop",
discount: 1234567890,
expire_voucher: "Thu Jun 29 2023 11:09:33 GMT+0530 (India Standard Time)",

    };
    const response: any = await request(app).post("/api/v1/voucher/edit_voucher").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(typeof response.body.data).toBe("object");
    expect(response.body.data.expire_voucher).toBe(body.expire_voucher);
  });

  test("Delete Voucher", async () => {
    const body: any = {
      voucher_id: voucherId
    };
    const response: any = await request(app).post("/api/v1/voucher/delete_voucher").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
  });
});
