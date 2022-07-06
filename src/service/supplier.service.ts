import prisma from "../../prisma/client";
import { Supplier, Prisma } from "@prisma/client";
import { PageList } from "../core/pageList";
import { UpdateSupplierDto } from "../dto/supplier/updateSupplier.dto";
import { CreateSupplierDto } from "../dto/supplier/createSupplier.dto";

class SupplierServices {
  /**
   * Get suppliers by searchstring and pagination
   *
   * @param pageList pageList object
   * @returns List of Suppliers with pagination
   */
  async getSuppliers(pageList: PageList<Supplier>) {
    const { searchString, skip, take, orderBy } = pageList;

    const or: Prisma.SupplierWhereInput = searchString
      ? {
          OR: [
            { name: { contains: searchString as string } },
            { description: { contains: searchString as string } },
          ],
        }
      : {};

    const suppliers = await prisma.supplier.findMany({
      select: {
        uuid: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        supplierAddress:{
          select:{
            country:true,
            city:true,
            zipCode:true,
            street:true,
            building:true
          }
        },
        supplierContact:{
          select:{
            telephoneNumber:true,
            mobileNumber:true
          }
        }
      },
      where: {
        ...or,
        isDeleted: null,
      },
      take: Number(take) || undefined,
      skip: Number(skip) || undefined,
      orderBy: {
        updatedAt: orderBy as Prisma.SortOrder,
      },
    });
    return suppliers;
  }

  /**
   * Get Supplier by uuid
   * @param uuid uuid of the Supplier
   * @returns Supplier
   */
  async getSupplierByUuid(uuid: string) {
    return await prisma.supplier.findFirst({
      where: {
        uuid: uuid,
        isDeleted: null,
      },
      select: {
        name: true,
        description: true,
        updatedAt: true,
        createdAt: true,
        uuid: true,
        supplierAddress:{
          select:{
            country:true,
            city:true,
            zipCode:true,
            street:true,
            building:true
          }
        },
        supplierContact:{
          select:{
            telephoneNumber:true,
            mobileNumber:true
          }
        }
      },
    });
  }

  /**
   * Create a new Supplier
   *
   * @param model CreateSupplierDto
   * @returns Boolean
   */
  async createSupplier(model: CreateSupplierDto) {
    let {
      name,
      description,
      mobileNumber,
      telephoneNumber,
      country,
      city,
      zipCode,
      street,
      building,
    } = model;

    let persistSupplier = async () => {
      return new Promise<Boolean>(async (resolve, reject) => {
        await prisma.supplier
          .create({
            data: {
              name,
              description,
              supplierAddress: {
                create: {
                  country,
                  city,
                  zipCode,
                  street,
                  building,
                  createdAt:new Date()
                },
              },
              supplierContact: {
                create: {
                  mobileNumber,
                  telephoneNumber,
                  createdAt:new Date()
                },
              },
            },
          })
          .then(() => {
            resolve(true);
          })
          .catch((error) => reject(error));
      });
    };

    let result = new Promise<Boolean>(async (resolve, reject) => {
      await persistSupplier()
        .then(() => {
          resolve(true);
        })
        .catch((error) => reject(error));
    });

    return result;
  }

  /**
   * Update an existing Supplier
   *
   * @param model UpdateSupplierDto
   * @returns Boolean
   */
  async updateSupplier(model: UpdateSupplierDto) {
    let {
      name,
      description,
      mobileNumber,
      telephoneNumber,
      country,
      city,
      zipCode,
      street,
      building,
    } = model;
    let persistUpdatedSupplier = async (Supplier: any) => {
      return new Promise<any>(async (resolve, reject) => {
        await prisma.supplier
          .update({
            select: {
              uuid: true,
              name: true,
              description: true,
              createdAt: true,
              updatedAt: true,
            },
            where: { id: Supplier.id },
            data: {
              name: name,
              description: description,
              updatedAt: new Date(),
              supplierAddress: {
                update: {
                  country,
                  city,
                  zipCode,
                  street,
                  building,
                  updatedAt: new Date(),
                },
              },
              supplierContact: {
                update: {
                  mobileNumber,
                  telephoneNumber,
                },
              },
            },
          })
          .then((result) => resolve(result))
          .catch((error) => reject(error));
      });
    };
    let result = new Promise<any>(async (resolve, reject) => {
      await this.findExistingSupplier(model.uuid)
        .then(persistUpdatedSupplier)
        .then((result) => resolve(result))
        .catch((error) => {
          reject(error);
        });
    });

    return result;
  }

  /**
   * Delete a Supplier
   *
   * @param uuid uuid of the Supplier
   * @returns Boolean
   */
  async deleteSupplier(uuid: string) {
    let persistDeletedSupplier = async (Supplier) => {
      return new Promise<Boolean>(async (resolve, reject) => {
        await prisma.supplier
          .update({
            select: {
              uuid: true,
            },
            where: { id: Supplier.id },
            data: {
              isDeleted: true,
              deletedAt: new Date(),
              updatedAt: new Date(),
            },
          })
          .then(() => resolve(true))
          .catch((error) => reject(error));
      });
    };

    let result = new Promise<Boolean>(async (resolve, reject) => {
      await this.findExistingSupplier(uuid)
        .then(persistDeletedSupplier)
        .then((result) => resolve(result))
        .catch((error) => {
          reject(error);
        });
    });
    return result;
  }

  private async findExistingSupplier(uuid: string) {
    return new Promise(async (resolve, reject) => {
      await prisma.supplier
        .findUnique({
          where: { uuid: uuid },
          select: {
            id: true,
          },
        })
        .then((Supplier) => {
          if (Supplier === null) {
            reject(Error(`${uuid} uuid is not an existing supplier`));
          }
          resolve(Supplier);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
export default SupplierServices;
