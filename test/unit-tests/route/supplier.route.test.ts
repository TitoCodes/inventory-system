import SupplierService from "../../../src/service/supplier.service";
import request from "supertest";
import app from "../../../src/app";

let expectedSupplier:any;
let expectedSuppliers:any;
let createdAt: Date;
let updatedAt: Date;

beforeAll(() => {
  createdAt = new Date();
  updatedAt = new Date();
  expectedSupplier = {
    id: 1,
    name: "Supplier",
    description: "sample description",
    uuid: "dsad-3213-das213-adsa",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    isDeleted: null,
  };
  expectedSuppliers = [
    {
      name: "sample",
      description: "rovering rover",
      uuid: "dsad-3213-das213-adsa",
      createdAt: createdAt,
      updatedAt: updatedAt,
    },
    {
      name: "sample 2",
      description: "Samplling sample",
      uuid: "adsad-3213-das213-adsa",
      createdAt: createdAt,
      updatedAt: updatedAt,
    },
  ];
});

describe("Get /Supplier", () => {
  test("should return suppliers", async () => {
    jest
      .spyOn(SupplierService.prototype, "getSuppliers")
      .mockResolvedValue(expectedSuppliers);

    let response = await request(app)
      .get("/Supplier")
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  test("should return status code 400", async () => {
    jest
      .spyOn(SupplierService.prototype, "getSuppliers")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .get("/Supplier")
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
  });
});

describe("Get /Supplier/:uuid", () => {
  test("should return a Supplier", async () => {
    jest
      .spyOn(SupplierService.prototype, "getSupplierByUuid")
      .mockResolvedValue(expectedSupplier);

    let response = await request(app)
      .get("/Supplier/1")
      .set("Accept", "application/json");

    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual(expectedSupplier.name);
    expect(response.body.description).toEqual(expectedSupplier.description);
    expect(response.body.createdAt).toEqual(
      expectedSupplier.createdAt.toISOString()
    );
    expect(response.body.updatedAt).toEqual(
      expectedSupplier.updatedAt.toISOString()
    );
    expect(response.body.uuid).toEqual(expectedSupplier.uuid);
  });

  test("should receive status code 400", async () => {
    jest
      .spyOn(SupplierService.prototype, "getSupplierByUuid")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .get("/Supplier/1")
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
  });
});

describe("Post /Supplier", () => {
  test("should return status code 201", async () => {
    let { name, description } = expectedSupplier;

    jest
      .spyOn(SupplierService.prototype, "createSupplier")
      .mockResolvedValue(expectedSupplier);

    let response = await request(app)
      .post("/Supplier")
      .send({ name, description })
      .set("Accept", "application/json");

    expect(response.status).toEqual(201);
  });

  test("should return status code 400", async () => {
    let { name, description } = expectedSupplier;
    jest
      .spyOn(SupplierService.prototype, "createSupplier")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .post("/Supplier")
      .send({ name, description })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
  });

  test("should return status code 422 when name is not supplied", async () => {
    let { name, description } = expectedSupplier;
    jest
      .spyOn(SupplierService.prototype, "createSupplier")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .post("/Supplier")
      .send({ undefined, description })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(`\"name\" is required`);
  });

  test("should return status 422 code when description is not supplied", async () => {
    let { name, description } = expectedSupplier;
    jest
      .spyOn(SupplierService.prototype, "createSupplier")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .post("/Supplier")
      .send({ name, undefined })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(`\"description\" is required`);
  });
});

describe("Update /Supplier/:uuid", () => {
  test("should return 204 status code", async () => {
    let { name, description } = expectedSupplier;
    jest
      .spyOn(SupplierService.prototype, "updateSupplier")
      .mockResolvedValue(expectedSupplier);

    let response = await request(app)
      .put("/Supplier/1")
      .send({ name, description })
      .set("Accept", "application/json");

    expect(response.status).toBe(204);
  });

  test("should return status code 400", async () => {
    let { name, description } = expectedSupplier;
    jest
      .spyOn(SupplierService.prototype, "updateSupplier")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .put("/Supplier/1")
      .send({ name, description })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
  });

  test("should return status code 422 when name is not supplied", async () => {
    let { name, description } = expectedSupplier;
    jest
      .spyOn(SupplierService.prototype, "updateSupplier")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .put("/Supplier/1")
      .send({ undefined, description })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(`\"name\" is required`);
  });

  test("should return status code 422 when description is not supplied", async () => {
    let { name, description } = expectedSupplier;
    jest
      .spyOn(SupplierService.prototype, "updateSupplier")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .put("/Supplier/1")
      .send({ name, undefined })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(`\"description\" is required`);
  });
});

describe("Delete /Supplier/:uuid", () => {
  test("should return status code 204", async () =>{
    jest
      .spyOn(SupplierService.prototype, "deleteSupplier")
      .mockResolvedValue(expectedSupplier);

    let response = await request(app)
      .delete("/Supplier/1")
      .set("Accept", "application/json");

    expect(response.status).toBe(204);
  });

  test("should return status code 422 when id is not supplied", async () =>{
    jest
      .spyOn(SupplierService.prototype, "deleteSupplier")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .delete("/Supplier/1")
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
  });
});
