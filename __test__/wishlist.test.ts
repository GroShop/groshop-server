
/* eslint-disable @typescript-eslint/no-explicit-any */
process.env.NODE_ENV = "test";
import User from "../src/models/user.model";
import wishlist from "../src/models/wishlist.model";
import mongoose from "mongoose";
import toBeType from "jest-tobetype";
import request from "supertest";
import app from "../src/app";

expect.extend(toBeType);

let token, wishlistId;

afterAll(async () => {
  await User.deleteMany({});
  await wishlist.deleteMany({});
  await mongoose.disconnect();
});

describe("wishlist Test", () => {
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

  test("Create wishlist", async () => {
    const body: any = {
      wishlist_product: ["qwerty", "uiop"],
created_by: "623980a44794ef59b9024c15",

    };
    const response: any = await request(app).post("/api/v1/wishlist/create_wishlist").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(typeof response.body.data).toBe("object");
    expect(response.body.data).toHaveProperty("_id");
    wishlistId = response.body.data._id;
  });

  test("Get wishlist", async () => {
    const body: any = {
      wishlist_id: wishlistId
    };
    const response: any = await request(app).post("/api/v1/wishlist/get_wishlist").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(typeof response.body.data).toBe("object");
    expect(response.body.data).toHaveProperty("_id");
  });

  test("Get Many wishlist", async () => {
    const body: any = {
      search: "qwertyuiop",
    };
    const response: any = await request(app).post("/api/v1/wishlist/get_many_wishlist").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(typeof response.body.data.docs).toBe("object");
    expect(response.body.data.docs[0]).toHaveProperty("_id");
  });

  test("Edit wishlist", async () => {
    const body: any = {
      wishlist_id: wishlistId,
      wishlist_product: ["qwerty", "uiop"],

    };
    const response: any = await request(app).post("/api/v1/wishlist/edit_wishlist").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(typeof response.body.data).toBe("object");
    expect(response.body.data.).toBe(body.);
  });

  test("Delete wishlist", async () => {
    const body: any = {
      wishlist_id: wishlistId
    };
    const response: any = await request(app).post("/api/v1/wishlist/delete_wishlist").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
  });
});
