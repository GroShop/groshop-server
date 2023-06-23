
/* eslint-disable @typescript-eslint/no-explicit-any */
process.env.NODE_ENV = "test";
import User from "../src/models/user.model";
import searchProduct from "../src/models/search_product.model";
import mongoose from "mongoose";
import toBeType from "jest-tobetype";
import request from "supertest";
import app from "../src/app";

expect.extend(toBeType);

let token, searchproductId;

afterAll(async () => {
  await User.deleteMany({});
  await searchProduct.deleteMany({});
  await mongoose.disconnect();
});

describe("searchProduct Test", () => {
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

  test("Create searchProduct", async () => {
    const body: any = {
      product: ["qwerty", "uiop"],
search_product: ["qwerty", "uiop"],
created_by: "623980a44794ef59b9024c15",

    };
    const response: any = await request(app).post("/api/v1/searchproduct/create_searchproduct").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(typeof response.body.data).toBe("object");
    expect(response.body.data).toHaveProperty("_id");
    searchproductId = response.body.data._id;
  });

  test("Get searchProduct", async () => {
    const body: any = {
      searchproduct_id: searchproductId
    };
    const response: any = await request(app).post("/api/v1/searchproduct/get_searchproduct").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(typeof response.body.data).toBe("object");
    expect(response.body.data).toHaveProperty("_id");
  });

  test("Get Many searchProduct", async () => {
    const body: any = {
      search: "qwertyuiop",
    };
    const response: any = await request(app).post("/api/v1/searchproduct/get_many_searchproduct").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(typeof response.body.data.docs).toBe("object");
    expect(response.body.data.docs[0]).toHaveProperty("_id");
  });

  test("Edit searchProduct", async () => {
    const body: any = {
      searchproduct_id: searchproductId,
      product: ["qwerty", "uiop"],
search_product: ["qwerty", "uiop"],

    };
    const response: any = await request(app).post("/api/v1/searchproduct/edit_searchproduct").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(typeof response.body.data).toBe("object");
    expect(response.body.data.).toBe(body.);
  });

  test("Delete searchProduct", async () => {
    const body: any = {
      searchproduct_id: searchproductId
    };
    const response: any = await request(app).post("/api/v1/searchproduct/delete_searchproduct").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
  });
});
