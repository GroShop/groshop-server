
/* eslint-disable @typescript-eslint/no-explicit-any */
process.env.NODE_ENV = "test";
import User from "../src/models/user.model";
import Cart from "../src/models/cart.model";
import mongoose from "mongoose";
import toBeType from "jest-tobetype";
import request from "supertest";
import app from "../src/app";

expect.extend(toBeType);

let token, cartId;

afterAll(async () => {
  await User.deleteMany({});
  await Cart.deleteMany({});
  await mongoose.disconnect();
});

describe("Cart Test", () => {
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

  test("Create Cart", async () => {
    const body: any = {
      product: "623980a44794ef59b9024c15",
status: "qwertyuiop",
weight: 1234567890,
created_by: "623980a44794ef59b9024c15",

    };
    const response: any = await request(app).post("/api/v1/cart/create_cart").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(typeof response.body.data).toBe("object");
    expect(response.body.data).toHaveProperty("_id");
    cartId = response.body.data._id;
  });

  test("Get Cart", async () => {
    const body: any = {
      cart_id: cartId
    };
    const response: any = await request(app).post("/api/v1/cart/get_cart").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(typeof response.body.data).toBe("object");
    expect(response.body.data).toHaveProperty("_id");
  });

  test("Get Many Cart", async () => {
    const body: any = {
      search: "qwertyuiop",
    };
    const response: any = await request(app).post("/api/v1/cart/get_many_cart").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(typeof response.body.data.docs).toBe("object");
    expect(response.body.data.docs[0]).toHaveProperty("_id");
  });

  test("Edit Cart", async () => {
    const body: any = {
      cart_id: cartId,
      product: "623980a44794ef59b9024c15",
status: "qwertyuiop",
weight: 1234567890,

    };
    const response: any = await request(app).post("/api/v1/cart/edit_cart").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(typeof response.body.data).toBe("object");
    expect(response.body.data.weight).toBe(body.weight);
  });

  test("Delete Cart", async () => {
    const body: any = {
      cart_id: cartId
    };
    const response: any = await request(app).post("/api/v1/cart/delete_cart").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
  });
});
