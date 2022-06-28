import { prismaMock } from "../../../prisma/singleton";
import { PageList } from "../../../src/core/pageList";
import ItemService from "../../../src/service/item.service";

let itemService: ItemService;
let createdAt: Date;
let updatedAt: Date;
let expectedItem;
let expectedItems;

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

describe("Create item", () => {
  const newItem = {
    name: "Sample",
    description: "Sample description",
    categoryId: "dsajsdk-23178213-32132-3123132",
    isDraft: false,
  };
  const category = {
    id: 1,
    name: "category",
    description: "sample description",
    uuid: "dsad-3213-das213-adsa",
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: null,
    isDeleted: null,
  };

  test("should create a new item", async () => {
    prismaMock.category.findFirst.mockResolvedValue(category);
    prismaMock.item.findUnique.mockResolvedValue(null);
    prismaMock.item.create.mockResolvedValue(expectedItem);

    await itemService.createItem(newItem).then((result) => {
      expect(result).toBe(true);
    });
  });

  test("should throw category id is not existing error", async () => {
    prismaMock.category.findFirst.mockResolvedValue(null);
    prismaMock.item.findUnique.mockResolvedValue(null);
    prismaMock.item.create.mockResolvedValue(expectedItem);

    await expect(itemService.createItem(newItem)).rejects.toThrowError(
      `${newItem.categoryId} id  is not an existing category`
    );
  });

  test("should throw error from prisma.create", async () => {
    let error = new Error(`Something went wrong`);
    prismaMock.category.findFirst.mockResolvedValue(category);
    prismaMock.item.findUnique.mockResolvedValue(null);
    prismaMock.item.create.mockRejectedValue(error);

    await expect(itemService.createItem(newItem)).rejects.toThrowError(
      `Something went wrong`
    );
  });
});

describe("Update item", () => {
  const updateItem = {
    name: "Sample",
    description: "Sample description",
    categoryId: "dsajsdk-23178213-32132-3123132",
    uuid: "dsad-3213-das213-adsa",
    isDraft: false,
  };

  const category = {
    id: 1,
    name: "category",
    description: "sample description",
    uuid: "dsad-3213-das213-adsa",
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: null,
    isDeleted: null,
  };

  test("should update an existing item", async () => {
    prismaMock.category.findFirst.mockResolvedValue(category);
    prismaMock.item.findUnique.mockResolvedValue(expectedItem);
    prismaMock.item.update.mockResolvedValue(expectedItem);

    let result = await itemService.updateItem(updateItem);
    expect(result).toBe(true);
  });

  test("should throw category id is not existing error", async () => {
    prismaMock.category.findFirst.mockResolvedValue(null);
    prismaMock.item.findUnique.mockResolvedValue(expectedItem);
    prismaMock.item.update.mockResolvedValue(expectedItem);

    await expect(itemService.updateItem(updateItem)).rejects.toThrowError(
      `${updateItem.categoryId} id  is not an existing category`
    );
  });

  test("should throw error from prisma.findUnique", async () => {
    let error = new Error(`Something went wrong`);
    prismaMock.item.findUnique.mockRejectedValue(error);

    await expect(itemService.updateItem(updateItem)).rejects.toThrowError(
      `Something went wrong`
    );
  });

  test("should throw error from prisma.update", async () => {
    let error = new Error(`Something went wrong`);
    prismaMock.category.findFirst.mockResolvedValue(category);
    prismaMock.item.findUnique.mockResolvedValue(expectedItem);
    prismaMock.item.update.mockRejectedValue(error);

    await expect(itemService.updateItem(updateItem)).rejects.toThrowError(
      `Something went wrong`
    );
  });

  test("should throw item id is not existing error", async () => {
    prismaMock.category.findFirst.mockResolvedValue(category);
    prismaMock.item.findUnique.mockResolvedValue(null);
    prismaMock.item.update.mockResolvedValue(expectedItem);

    await expect(itemService.updateItem(updateItem)).rejects.toThrowError(
      `${updateItem.uuid} id is not an existing item`
    );
  });
});

describe("Delete item", () => {
  let toBeDeletedId = "dsaddsa-sadjasd-23123-dsadads";
  test("should delete an item", async () => {
    prismaMock.item.findUnique.mockResolvedValue(expectedItem);
    prismaMock.item.update.mockResolvedValue(expectedItem);

    let result = await itemService.deleteItem(toBeDeletedId);
    expect(result).toBe(true);
  });

  test("should throw not existing error", async () => {
    prismaMock.item.findUnique.mockResolvedValue(null);

    await expect(itemService.deleteItem(toBeDeletedId)).rejects.toThrowError(
      `${toBeDeletedId} id is not an existing item`
    );
  });

  test("should throw error from prisma.findUnique", async () => {
    let error = new Error(`Something went wrong`);
    prismaMock.item.findUnique.mockRejectedValue(error);

    await expect(itemService.deleteItem(toBeDeletedId)).rejects.toThrowError(
      `Something went wrong`
    );
  });

  test("should throw error from prisma.update", async () => {
    let error = new Error(`Something went wrong`);
    prismaMock.item.findUnique.mockResolvedValue(expectedItem);
    prismaMock.item.update.mockRejectedValue(error);

    await expect(itemService.deleteItem(toBeDeletedId)).rejects.toThrowError(
      `Something went wrong`
    );
  });
});

describe("Get item by id", () => {
  test("retrieve item by id", async () => {
    let itemId = "40c05336-daa7-439c-b1b4-e7f8f9c9cac0";
    prismaMock.item.findFirst.mockResolvedValue(expectedItem);

    await expect(itemService.getItemByid(itemId)).resolves.toEqual({
      id: 1,
      name: "Ipad Air",
      description: "Ipad Air",
      uuid: "dsad-3213-das213-adsa",
      createdAt: createdAt,
      updatedAt: updatedAt,
      deletedAt: null,
      isDraft: false,
      isDeleted: null,
    });
  });
});

describe("Get items", () => {
  test("retrieve items", async () => {
    prismaMock.item.findMany.mockResolvedValue(expectedItems);

    let result = await itemService.getItems(
      new PageList("", undefined, undefined, undefined)
    );
    expect(result.length).toBe(3);
  });

  test("retrieve items with searchstring", async () => {
    prismaMock.item.findMany.mockResolvedValue(expectedItems);

    let result = await itemService.getItems(
      new PageList("sample", undefined, undefined, undefined)
    );
    expect(result.length).toBe(3);
  });

  test("retrieve items with searchstring and isDraft filter", async () => {
    prismaMock.item.findMany.mockResolvedValue(expectedItems);

    let result = await itemService.getItems(
      new PageList("sample", undefined, undefined, undefined),
      false
    );
    expect(result.length).toBe(3);
  });
});
