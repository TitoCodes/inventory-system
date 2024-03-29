import { prismaMock } from "../../../prisma/singleton";
import { PageList } from "../../../src/core/pageList";
import CategoryServices from "../../../src/service/category.service";

let categoryServices: CategoryServices;
let createdAt: Date;
let updatedAt: Date;
let expectedCategory:any;
let expectedCategories:any;

beforeAll(() => {
  categoryServices = new CategoryServices();
  createdAt = new Date();
  updatedAt = new Date();
  expectedCategory = {
    id: 1,
    name: "category",
    description: "sample description",
    uuid: "dsad-3213-das213-adsa",
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: null,
    isDeleted: null,
  };
  expectedCategories = [
    {
      id: 1,
      name: "sample",
      description: "rovering rover",
      uuid: "dsad-3213-das213-adsa",
      createdAt: createdAt,
      updatedAt: updatedAt,
      deletedAt: null,
      isDeleted: null,
    },
    {
      id: 2,
      name: "sample 2",
      description: "Samplling sample",
      uuid: "adsad-3213-das213-adsa",
      createdAt: createdAt,
      updatedAt: updatedAt,
      deletedAt: null,
      isDeleted: null,
    },
  ];
});

describe("Create category", () => {
  test("should create a new category", async () => {
    prismaMock.category.findUnique.mockResolvedValue(null);
    prismaMock.category.create.mockResolvedValue(expectedCategory);

    await categoryServices.createCategory(expectedCategory).then((result) => {
      expect(result).toBe(true);
    });
  });

  test("should throw category name already exists error", async () => {
    prismaMock.category.findUnique.mockResolvedValue(expectedCategory);
    prismaMock.category.create.mockResolvedValue(expectedCategory);

    await expect(
      categoryServices.createCategory(expectedCategory)
    ).rejects.toThrowError(
      `Category name ${expectedCategory.name} already exist.`
    );
  });

  test("should throw error from prisma.create", async () => {
    let error = new Error(`Something went wrong`);
    prismaMock.category.findUnique.mockResolvedValue(null);
    prismaMock.category.create.mockRejectedValue(error);

    await expect(categoryServices.createCategory(expectedCategories)).rejects.toThrowError(
      `Something went wrong`
    );
  });

  test("should throw error from prisma.findUnique", async () => {
    let error = new Error(`Something went wrong`);
    prismaMock.category.findUnique.mockRejectedValue(error);

    await expect(categoryServices.createCategory(expectedCategories)).rejects.toThrowError(
      `Something went wrong`
    );
  });
});

describe("Update category", () => {
  test("should update an existing category", async () => {
    prismaMock.category.findUnique.mockResolvedValue(expectedCategory);
    prismaMock.category.update.mockResolvedValue(expectedCategory);

    let result = await categoryServices.updateCategory(expectedCategory);
    expect(result).toBe(expectedCategory);
  });

  test("should throw category is not existing error", async () => {
    prismaMock.category.findUnique.mockResolvedValue(null);
    prismaMock.category.update.mockResolvedValue(expectedCategory);

    await expect(
      categoryServices.updateCategory(expectedCategory)
    ).rejects.toThrowError(
      `${expectedCategory.uuid} uuid is not an existing category`
    );
  });

  test("should throw error from prisma.create", async () => {
    let error = new Error(`Something went wrong`);
    prismaMock.category.findUnique.mockResolvedValue(expectedCategories);
    prismaMock.category.update.mockRejectedValue(error);

    await expect(categoryServices.updateCategory(expectedCategories)).rejects.toThrowError(
      `Something went wrong`
    );
  });

  test("should throw error from prisma.findUnique", async () => {
    let error = new Error(`Something went wrong`);
    prismaMock.category.findUnique.mockRejectedValue(error);

    await expect(categoryServices.updateCategory(expectedCategories)).rejects.toThrowError(
      `Something went wrong`
    );
  });
});

describe("Delete category", () => {
  test("should delete a category", async () => {
    prismaMock.category.findUnique.mockResolvedValue(expectedCategory);
    prismaMock.category.update.mockResolvedValue(expectedCategory);

    let result = await categoryServices.deleteCategory(expectedCategory.uuid);
    expect(result).toBe(true);
  });

  test("should throw not existing error", async () => {
    prismaMock.category.findUnique.mockResolvedValue(null);

    await expect(
      categoryServices.deleteCategory(expectedCategory.uuid)
    ).rejects.toThrowError(
      `${expectedCategory.uuid} uuid is not an existing category`
    );
  });

  test("should throw error from prisma.delete", async () => {
    let error = new Error(`Something went wrong`);
    prismaMock.category.findUnique.mockResolvedValue(expectedCategories);
    prismaMock.category.update.mockRejectedValue(error);

    await expect(categoryServices.deleteCategory(expectedCategories)).rejects.toThrowError(
      `Something went wrong`
    );
  });
});

describe("Get category by id", () => {
  test("retrieve category by id", async () => {
    let categoryId = "40c05336-daa7-439c-b1b4-e7f8f9c9cac0";
    prismaMock.category.findFirst.mockResolvedValue(expectedCategory);

    await expect(categoryServices.getCategoryByUuid(categoryId)).resolves.toEqual(
      {
        id: 1,
        name: "category",
        description: "sample description",
        uuid: "dsad-3213-das213-adsa",
        createdAt: createdAt,
        updatedAt: updatedAt,
        deletedAt: null,
        isDeleted: null,
      }
    );
  });
});

describe("Get categories", () => {
  test("retrieve categories", async () => {
    prismaMock.category.findMany.mockResolvedValue(expectedCategories);

    let result = await categoryServices.getCategories(
      new PageList("", undefined, undefined, undefined)
    );
    expect(result.length).toBe(2);
  });

  test("retrieve categories with searchstring", async () => {
    prismaMock.category.findMany.mockResolvedValue(expectedCategories);

    let result = await categoryServices.getCategories(
      new PageList("sample", undefined, undefined, undefined)
    );
    expect(result.length).toBe(2);
  });
});
