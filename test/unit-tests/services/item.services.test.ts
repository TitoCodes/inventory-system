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

  test("should throw item id is not existing error", async () => {
    prismaMock.category.findFirst.mockResolvedValue(category);
    prismaMock.item.findUnique.mockResolvedValue(null);
    prismaMock.item.update.mockResolvedValue(expectedItem);

    await expect(itemService.updateItem(updateItem)).rejects.toThrowError(
      `${updateItem.uuid} id is not an existing item`
    );
  });
});

// describe("Delete category", () => {
//   test("should delete a category", async () => {
//     prismaMock.category.findUnique.mockResolvedValue(expectedCategory);
//     prismaMock.category.update.mockResolvedValue(expectedCategory);

//     let result = await categoryServices.deleteCategory(expectedCategory.uuid);
//     expect(result).toBe(true);
//   });

//   test("should throw not existing error", async () => {
//     prismaMock.category.findUnique.mockResolvedValue(null);

//     await expect(
//       categoryServices.deleteCategory(expectedCategory.uuid)
//     ).rejects.toThrowError(
//       `${expectedCategory.uuid} id is not an existing category`
//     );
//   });
// });

// describe("Get category by id", () => {
//   test("retrieve category by id", async () => {
//     let categoryId = "40c05336-daa7-439c-b1b4-e7f8f9c9cac0";
//     prismaMock.category.findFirst.mockResolvedValue(expectedCategory);

//     await expect(categoryServices.getCategoryByid(categoryId)).resolves.toEqual(
//       {
//         id: 1,
//         name: "category",
//         description: "sample description",
//         uuid: "dsad-3213-das213-adsa",
//         createdAt: createdAt,
//         updatedAt: updatedAt,
//         deletedAt: null,
//         isDeleted: null,
//       }
//     );
//   });
// });

// describe("Get categories", () => {
//   test("retrieve categories", async () => {
//     prismaMock.category.findMany.mockResolvedValue(expectedCategories);

//     let result = await categoryServices.getCategories(
//       new PageList("", undefined, undefined, undefined)
//     );
//     expect(result.length).toBe(2);
//   });

//   test("retrieve categories with searchstring", async () => {
//     prismaMock.category.findMany.mockResolvedValue(expectedCategories);

//     let result = await categoryServices.getCategories(
//       new PageList("sample", undefined, undefined, undefined)
//     );
//     expect(result.length).toBe(2);
//   });
// });
