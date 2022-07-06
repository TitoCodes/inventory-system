import { prismaMock } from "../../../prisma/singleton";
import { PageList } from "../../../src/core/pageList";
import SupplierServices from "../../../src/service/supplier.service";

let supplierServices: SupplierServices;
let createdAt: Date;
let updatedAt: Date;
let expectedSupplier: any;
let expectedSuppliers: any;

beforeAll(() => {
  supplierServices = new SupplierServices();
  createdAt = new Date();
  updatedAt = new Date();
  expectedSupplier = {
    id: 1,
    name: "supplier",
    description: "sample description",
    uuid: "dsad-3213-das213-adsa",
    createdAt: createdAt,
    updatedAt: updatedAt,
    deletedAt: null,
    isDeleted: null,
    supplierAddress: {
      country: "Fictional country",
      city: "Fictional city",
      zipCode: "1600",
      street: "Fictional street",
      building: "Fictional building",
    },
    supplierContact: {
      telephoneNumber: "123456789",
      mobileNumber: "0123123915",
    },
  };
  expectedSuppliers = [
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

describe("Create supplier", () => {
  let newSupplier = {
    name: "Some supplier",
    description: "A supplier with fictional details",
    country: "Fictional country",
    city: "Fictional city",
    zipCode: "1600",
    street: "Fictional street",
    telephoneNumber: "123456789",
    mobileNumber: "0123123915",
  };

  test("should create a new supplier", async () => {
    prismaMock.supplier.create.mockResolvedValue(expectedSupplier);

    await supplierServices.createSupplier(newSupplier).then((result) => {
      expect(result).toBe(true);
    });
  });

  test("should throw error from prisma.create", async () => {
    let error = new Error(`Something went wrong`);
    prismaMock.supplier.create.mockRejectedValue(error);

    await expect(
      supplierServices.createSupplier(newSupplier)
    ).rejects.toThrowError(`Something went wrong`);
  });
});

describe("Update supplier", () => {
  test("should update an existing supplier", async () => {
    prismaMock.supplier.findUnique.mockResolvedValue(expectedSupplier);
    prismaMock.supplier.update.mockResolvedValue(expectedSupplier);

    let result = await supplierServices.updateSupplier(expectedSupplier);
    expect(result).toBe(expectedSupplier);
  });

  test("should throw supplier is not existing error", async () => {
    prismaMock.supplier.findUnique.mockResolvedValue(null);
    prismaMock.supplier.update.mockResolvedValue(expectedSupplier);

    await expect(
      supplierServices.updateSupplier(expectedSupplier)
    ).rejects.toThrowError(
      `${expectedSupplier.uuid} uuid is not an existing supplier`
    );
  });

  test("should throw error from prisma.create", async () => {
    let error = new Error(`Something went wrong`);
    prismaMock.supplier.findUnique.mockResolvedValue(expectedSuppliers);
    prismaMock.supplier.update.mockRejectedValue(error);

    await expect(
      supplierServices.updateSupplier(expectedSuppliers)
    ).rejects.toThrowError(`Something went wrong`);
  });

  test("should throw error from prisma.findUnique", async () => {
    let error = new Error(`Something went wrong`);
    prismaMock.supplier.findUnique.mockRejectedValue(error);

    await expect(
      supplierServices.updateSupplier(expectedSuppliers)
    ).rejects.toThrowError(`Something went wrong`);
  });
});

describe("Delete supplier", () => {
  test("should delete a supplier", async () => {
    prismaMock.supplier.findUnique.mockResolvedValue(expectedSupplier);
    prismaMock.supplier.update.mockResolvedValue(expectedSupplier);

    let result = await supplierServices.deleteSupplier(expectedSupplier.uuid);
    expect(result).toBe(true);
  });

  test("should throw not existing error", async () => {
    prismaMock.supplier.findUnique.mockResolvedValue(null);

    await expect(
      supplierServices.deleteSupplier(expectedSupplier.uuid)
    ).rejects.toThrowError(
      `${expectedSupplier.uuid} uuid is not an existing supplier`
    );
  });

  test("should throw error from prisma.delete", async () => {
    let error = new Error(`Something went wrong`);
    prismaMock.supplier.findUnique.mockResolvedValue(expectedSuppliers);
    prismaMock.supplier.update.mockRejectedValue(error);

    await expect(
      supplierServices.deleteSupplier(expectedSuppliers)
    ).rejects.toThrowError(`Something went wrong`);
  });
});

describe("Get supplier by id", () => {
  test("retrieve supplier by id", async () => {
    let supplierId = "40c05336-daa7-439c-b1b4-e7f8f9c9cac0";
    prismaMock.supplier.findFirst.mockResolvedValue(expectedSupplier);

    await expect(
      supplierServices.getSupplierByUuid(supplierId)
    ).resolves.toEqual({
      id: 1,
      name: "supplier",
      description: "sample description",
      uuid: "dsad-3213-das213-adsa",
      createdAt: createdAt,
      updatedAt: updatedAt,
      deletedAt: null,
      isDeleted: null,
      supplierAddress: {
        country: "Fictional country",
        city: "Fictional city",
        zipCode: "1600",
        street: "Fictional street",
        building: "Fictional building",
      },
      supplierContact: {
        telephoneNumber: "123456789",
        mobileNumber: "0123123915",
      },
    });
  });
});

describe("Get suppliers", () => {
  test("retrieve suppliers", async () => {
    prismaMock.supplier.findMany.mockResolvedValue(expectedSuppliers);

    let result = await supplierServices.getSuppliers(
      new PageList("", undefined, undefined, undefined)
    );
    expect(result.length).toBe(2);
  });

  test("retrieve categories with searchstring", async () => {
    prismaMock.supplier.findMany.mockResolvedValue(expectedSuppliers);

    let result = await supplierServices.getSuppliers(
      new PageList("sample", undefined, undefined, undefined)
    );
    expect(result.length).toBe(2);
  });
});
