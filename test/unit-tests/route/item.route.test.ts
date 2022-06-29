import ItemService from "../../../src/service/item.service";
import request from "supertest";
import app from "../../../src/app";

let itemService: ItemService;
let expectedItem: any;
let expectedItems: any;
let createdAt: Date;
let updatedAt: Date;

beforeAll(() => {
  itemService = new ItemService();
  createdAt = new Date();
  updatedAt = new Date();
  expectedItem = {
    id: 1,
    name: "Ipad Air",
    description: "Ipad Air",
    uuid: "dsad-3213-das213-adsa",
    createdAt: createdAt,
    updatedAt: updatedAt,
    isDraft: false,
    deletedAt: null,
    isDeleted: null,
  };
  expectedItems = [
    {
      id: 1,
      name: "Sample item",
      description: "Sample item",
      uuid: "dsad-3213-das213-adsa",
      createdAt: createdAt,
      updatedAt: updatedAt,
      isDraft: true,
      deletedAt: null,
      isDeleted: null,
    },
    {
      id: 2,
      name: "Sample item 2",
      description: "Sample item 2",
      uuid: "adsad-3213-das213-adsa",
      createdAt: createdAt,
      updatedAt: updatedAt,
      deletedAt: null,
      isDeleted: null,
      isDraft: false,
    },
    {
      id: 3,
      name: "Sample item 3",
      description: "Sample item 3",
      uuid: "adsad-3213-das213-ljsqw3",
      createdAt: createdAt,
      updatedAt: updatedAt,
      deletedAt: null,
      isDeleted: null,
      isDraft: null,
    },
  ];
});

describe("Get /item", () => {
  test("should return items", async () => {
    jest
      .spyOn(ItemService.prototype, "getItems")
      .mockResolvedValue(expectedItems);

    let response = await request(app)
      .get("/item")
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
  });

  test("should return status code 400", async () => {
    jest
      .spyOn(ItemService.prototype, "getItems")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .get("/item")
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
  });
});

describe("Get /item:id", () => {
  test("should return an item", async () => {
    jest
      .spyOn(ItemService.prototype, "getItemByid")
      .mockResolvedValue(expectedItem);

    let response = await request(app)
      .get("/item/1")
      .set("Accept", "application/json");

    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual(expectedItem.name);
    expect(response.body.description).toEqual(expectedItem.description);
    expect(response.body.createdAt).toEqual(
      expectedItem.createdAt.toISOString()
    );
    expect(response.body.updatedAt).toEqual(
      expectedItem.updatedAt.toISOString()
    );
    expect(response.body.uuid).toEqual(expectedItem.uuid);
    expect(response.body.isDraft).toEqual(expectedItem.isDraft);
    expect(response.body.deletedAt).toEqual(expectedItem.deletedAt);
  });

  test("should receive status code 400", async () => {
    jest
      .spyOn(ItemService.prototype, "getItemByid")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .get("/item/1")
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
  });
});

describe("Post /item", () => {
  test("should return status code 201", async () => {
    let { name, description } = expectedItem;

    jest
      .spyOn(ItemService.prototype, "createItem")
      .mockResolvedValue(expectedItem);

    let response = await request(app)
      .post("/item")
      .send({ name, description })
      .set("Accept", "application/json");

    expect(response.status).toEqual(201);
  });

  test("should return status code 400", async () => {
    let { name, description } = expectedItem;
    jest
      .spyOn(ItemService.prototype, "createItem")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .post("/item")
      .send({ name, description })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
  });

  test("should return status code 422 when name is not supplied", async () => {
    let { name, description } = expectedItem;
    jest
      .spyOn(ItemService.prototype, "createItem")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .post("/item")
      .send({ undefined, description })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(`\"name\" is required`);
  });

  test("should return status 422 code when description is not supplied", async () => {
    let { name, description } = expectedItem;
    jest
      .spyOn(ItemService.prototype, "createItem")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .post("/item")
      .send({ name, undefined })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(`\"description\" is required`);
  });
});

describe("Update /item/:id", () => {
  test("should return 204 status code", async () => {
    let { name, description } = expectedItem;
    jest
      .spyOn(ItemService.prototype, "updateItem")
      .mockResolvedValue(expectedItem);

    let response = await request(app)
      .put("/item/1")
      .send({ name, description })
      .set("Accept", "application/json");

    expect(response.status).toBe(204);
  });

  test("should return status code 400", async () => {
    let { name, description } = expectedItem;
    jest
      .spyOn(ItemService.prototype, "updateItem")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .put("/item/1")
      .send({ name, description })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
  });

  test("should return status code 422 when name is not supplied", async () => {
    let { name, description } = expectedItem;
    jest
      .spyOn(ItemService.prototype, "updateItem")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .put("/item/1")
      .send({ undefined, description })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(`\"name\" is required`);
  });

  test("should return status code 422 when description is not supplied", async () => {
    let { name, description } = expectedItem;
    jest
      .spyOn(ItemService.prototype, "updateItem")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .put("/item/1")
      .send({ name, undefined })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(`\"description\" is required`);
  });
});

describe("Delete /item:id", () => {
  test("should return status code 204", async () =>{
    jest
      .spyOn(ItemService.prototype, "deleteItem")
      .mockResolvedValue(expectedItem);

    let response = await request(app)
      .delete("/item/1")
      .set("Accept", "application/json");

    expect(response.status).toBe(204);
  });

  test("should return status code 422 when id is not supplied", async () =>{
    jest
      .spyOn(ItemService.prototype, "deleteItem")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .delete("/item/1")
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
  });
});
