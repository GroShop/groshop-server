// @ts-nocheck
process.env.NODE_ENV = "test";
import User from "../src/models/user.model";
import _MNS_ from "../src/models/_MN_.model";
import mongoose from "mongoose";
import toBeType from "jest-tobetype";
import request from "supertest";
import app from "../src/app";

expect.extend(toBeType);

let token, _MN__id;

afterAll(async () => {
  await User.deleteMany({});
  await _MNS_.deleteMany({});
  await mongoose.disconnect();
});

describe("_MNS_ Test", () => {
  test("User signup", async () => {
    let body = {
      email: "kishore@yopmail.com",
      password: "qazwsx12",
      username: "kishore",
    };
    const response: any = await request(app).post("/api/v1/auth/user_signup").send(body);
    expect(response.statusCode).toBe(200);
  });
  test("User login", async () => {
    let body = {
      email: "kishore@yopmail.com",
      password: "qazwsx12",
    };
    const response: any = await request(app).post("/api/v1/auth/user_login").send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe("string");
    token = response.body.token;
  });

  test("Create _MNS_", async () => {
    let body: any = {
      _TCB_
    };
    const response: any = await request(app).post("/api/v1/_MN_/create__MN_").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(typeof response.body.data).toBe("object");
    expect(response.body.data).toHaveProperty("_id");
    _MN__id = response.body.data._id;
  });

  test("Get _MNS_", async () => {
    let body: any = {
      _MN__id: _MN__id
    };
    const response: any = await request(app).post("/api/v1/_MN_/get__MN_").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(typeof response.body.data).toBe("object");
    expect(response.body.data).toHaveProperty("_id");
  });

  test("Get Many _MNS_", async () => {
    let body: any = {
      search: "qwertyuiop",
    };
    const response: any = await request(app).post("/api/v1/_MN_/get_many__MN_").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(typeof response.body.data.docs).toBe("object");
    expect(response.body.data.docs[0]).toHaveProperty("_id");
  });

  test("Edit _MNS_", async () => {
    let body: any = {
      _MN__id: _MN__id,
      _TEB_
    };
    const response: any = await request(app).post("/api/v1/_MN_/edit__MN_").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(typeof response.body.data).toBe("object");
    expect(response.body.data._TEK_).toBe(body._TEK_);
  });

  test("Delete _MNS_", async () => {
    let body: any = {
      _MN__id: _MN__id
    };
    const response: any = await request(app).post("/api/v1/_MN_/delete__MN_").set("authorization", token).send(body);
    expect(response.statusCode).toBe(200);
  });
});
