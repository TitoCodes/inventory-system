import CategoryServices from "../../../src/service/category.service";
import request from "supertest";
import app from "../../../src/app";

let expectedCategory;
let expectedCategories;
let createdAt: Date;
let updatedAt: Date;

beforeAll(() => {
  createdAt = new Date();
  updatedAt = new Date();
  expectedCategory = {
    id: 1,
    name: "category",
    description: "sample description",
    uuid: "dsad-3213-das213-adsa",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    isDeleted: null,
  };
  expectedCategories = [
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

describe("Get /", () => {
  test("should return categories", async () => {
    jest
      .spyOn(CategoryServices.prototype, "getCategories")
      .mockResolvedValue(expectedCategories);

    let response = await request(app)
      .get("/category")
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  test("should return status code 400", async () => {
    jest
      .spyOn(CategoryServices.prototype, "getCategories")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .get("/category")
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
  });
});

describe("Get /category:id", () => {
  test("should return a category", async () => {
    jest
      .spyOn(CategoryServices.prototype, "getCategoryByid")
      .mockResolvedValue(expectedCategory);

    let response = await request(app)
      .get("/category/1")
      .set("Accept", "application/json");

    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual(expectedCategory.name);
    expect(response.body.description).toEqual(expectedCategory.description);
    expect(response.body.createdAt).toEqual(
      expectedCategory.createdAt.toISOString()
    );
    expect(response.body.updatedAt).toEqual(
      expectedCategory.updatedAt.toISOString()
    );
    expect(response.body.uuid).toEqual(expectedCategory.uuid);
  });

  test("should receive status code 400", async () => {
    jest
      .spyOn(CategoryServices.prototype, "getCategoryByid")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .get("/category/1")
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
  });
});

describe("Post /category", () => {
  test("should return status code 201", async () => {
    let { name, description } = expectedCategory;

    jest
      .spyOn(CategoryServices.prototype, "createCategory")
      .mockResolvedValue(expectedCategory);

    let response = await request(app)
      .post("/category")
      .send({ name, description })
      .set("Accept", "application/json");

    expect(response.status).toEqual(201);
  });

  test("should return status code 400", async () => {
    let { name, description } = expectedCategory;
    jest
      .spyOn(CategoryServices.prototype, "createCategory")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .post("/category")
      .send({ name, description })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
  });

  test("should return status code 422 when name is not supplied", async () => {
    let { name, description } = expectedCategory;
    jest
      .spyOn(CategoryServices.prototype, "createCategory")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .post("/category")
      .send({ undefined, description })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(`\"name\" is required`);
  });

  test("should return status 422 code when description is not supplied", async () => {
    let { name, description } = expectedCategory;
    jest
      .spyOn(CategoryServices.prototype, "createCategory")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .post("/category")
      .send({ name, undefined })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(`\"description\" is required`);
  });
});

describe("Update /category", () => {
  test("should return 204 status code", async () => {
    let { name, description } = expectedCategory;
    jest
      .spyOn(CategoryServices.prototype, "updateCategory")
      .mockResolvedValue(expectedCategory);

    let response = await request(app)
      .put("/category/1")
      .send({ name, description })
      .set("Accept", "application/json");

    expect(response.status).toBe(204);
  });

  test("should return status code 400", async () => {
    let { name, description } = expectedCategory;
    jest
      .spyOn(CategoryServices.prototype, "updateCategory")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .put("/category/1")
      .send({ name, description })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
  });

  test("should return status code 422 when name is not supplied", async () => {
    let { name, description } = expectedCategory;
    jest
      .spyOn(CategoryServices.prototype, "updateCategory")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .put("/category/1")
      .send({ undefined, description })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(`\"name\" is required`);
  });

  test("should return status code 422 when description is not supplied", async () => {
    let { name, description } = expectedCategory;
    jest
      .spyOn(CategoryServices.prototype, "updateCategory")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .put("/category/1")
      .send({ name, undefined })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(`\"description\" is required`);
  });
});

describe("Delete /category:id", () => {
  test("should return status code 204", async () =>{
    jest
      .spyOn(CategoryServices.prototype, "deleteCategory")
      .mockResolvedValue(expectedCategory);

    let response = await request(app)
      .delete("/category/1")
      .set("Accept", "application/json");

    expect(response.status).toBe(204);
  });

  test("should return status code 422 when id is not supplied", async () =>{
    jest
      .spyOn(CategoryServices.prototype, "deleteCategory")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .delete("/category/1")
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
  });
});
