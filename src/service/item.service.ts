import prisma from "../../prisma/client";
import { Item, Prisma } from "@prisma/client";
import { PageList } from "../core/pageList";
import { CreateItemDto } from "../dto/item/createItem.dto";
import { UpdateItemDto } from "../dto/item/updateItem.dto";
import { resolve } from "path";

class ItemServices {
  /**
   * Get items by searchstring, pagination and filters
   *
   * @param pageList pageList object
   * @param isDraft filter for type of items
   * @returns List of Items with pagination
   */
  async getItems(pageList: PageList<Item>, isDraft?: boolean) {
    const { searchString, skip, take, orderBy } = pageList;

    // isDraft is null -> returns all items
    // isDraft is false -> returns all published items
    // isDraft is true -> returns all draft items
    const published: Prisma.ItemWhereInput =
      isDraft == null
        ? {}
        : {
            isDraft: isDraft,
          };

    const or: Prisma.ItemWhereInput = searchString
      ? {
          OR: [
            { name: { contains: searchString as string } },
            { description: { contains: searchString as string } },
          ],
        }
      : {};

    const items = await prisma.item.findMany({
      select: {
        uuid: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        isDraft: true,
        category: {
          select: {
            uuid: true,
            name: true,
            description: true,
          },
        },
        itemPrice: {
          select: {
            suggestedRetailPrice: true,
            originalPrice: true,
            discountedPrice: true,
          },
        },
      },
      where: {
        ...or,
        ...published,
        isDeleted: null,
      },
      take: Number(take) || undefined,
      skip: Number(skip) || undefined,
      orderBy: {
        updatedAt: orderBy as Prisma.SortOrder,
      },
    });
    return items;
  }

  /**
   * Get item by uuid
   *
   * @param uuid uuid of the item
   * @returns Item
   */
  async getItemByUuid(uuid: string) {
    return await prisma.item.findFirst({
      where: {
        uuid: uuid,
        isDeleted: null,
      },
      select: {
        uuid: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        isDraft: true,
        category: {
          select: {
            uuid: true,
            name: true,
            description: true,
          },
        },
        itemPrice: {
          select: {
            suggestedRetailPrice: true,
            originalPrice: true,
            discountedPrice: true,
          },
        },
      },
    });
  }

  /**
   * Create a new item
   *
   * @param model CreateItemDto
   */
  async createItem(model: CreateItemDto) {
    let { name, description, categoryId, isDraft } = model;
    let persistItem = async (category: any) =>
      new Promise<Boolean>(async (resolve, reject) => {
        {
          await prisma.item
            .create({
              data: {
                name,
                description,
                categoryId: category.id,
                isDraft,
              },
            })
            .then(() => {
              resolve(true);
            })
            .catch((error) => {
              reject(error);
            });
        }
      });

    let result = new Promise<Boolean>(async (resolve, reject) => {
      await this.GetCategoryByUuid(categoryId)
        .then(persistItem)
        .then((result) => resolve(result))
        .catch((error) => {
          reject(error);
        });
    });

    return result;
  }

  /**
   * Update an existing item
   *
   * @param model UpdateItemDto
   */
  async updateItem(model: UpdateItemDto) {
    let foundItem: any;
    let persistUpdatedItem = async (category: any) => {
      return new Promise<Boolean>(async (resolve: any, reject: any) => {
        await prisma.item
          .update({
            select: {
              uuid: true,
              name: true,
              description: true,
              createdAt: true,
              updatedAt: true,
            },
            where: { id: foundItem.id },
            data: {
              name: model.name,
              description: model.description,
              updatedAt: new Date(),
              isDraft: model.isDraft,
              categoryId: category.id,
            },
          })
          .then(() => {
            resolve(true);
          })
          .catch((error) => {
            reject(error);
          });
      });
    };
    let validate = async (existingItem: any) => {
      return new Promise(async (resolve: any, reject: any) => {
        {
          if (existingItem === null) {
            reject(Error(`${model.uuid} uuid is not an existing item`));
          }

          await this.GetCategoryByUuid(model.categoryId)
            .then(async (category) => {
              resolve(category);
            })
            .catch((error) => {
              reject(error);
            });
        }
      });
    };
    let findExistingItem = async (model: any) => {
      return new Promise(async (resolve, reject) => {
        await prisma.item
          .findUnique({
            where: { uuid: model.uuid },
            select: {
              id: true,
            },
          })
          .then((existingItem) => {
            foundItem = existingItem;
            resolve(existingItem);
          })
          .catch((error) => reject(error));
      });
    };

    let result = new Promise<Boolean>(async (resolve, reject) => {
      await findExistingItem(model)
        .then(validate)
        .then(persistUpdatedItem)
        .then((result) => resolve(result))
        .catch((error) => {
          reject(error);
        });
    });
    return result;
  }

  /**
   * Delete an item
   *
   * @param uuid uuid of the item
   * @returns Boolean
   */
  async deleteItem(uuid: string) {
    let findExistingItem = () => {
      return new Promise<any>(async (resolve, reject) => {
        await prisma.item
          .findUnique({
            where: { uuid: uuid },
            select: {
              id: true,
            },
          })
          .then((result) => resolve(result))
          .catch((error) => reject(error));
      });
    };

    let validate = (itemData: any) => {
      return new Promise((resolve, reject) => {
        if (itemData === null) {
          reject(Error(`${uuid} uuid is not an existing item`));
        }
        resolve(itemData);
      });
    };

    let persistDeletedItem = async (itemData: any) => {
      return new Promise<Boolean>(async (resolve, reject) => {
        await prisma.item
          .update({
            select: {
              uuid: true,
            },
            where: { id: itemData.id },
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
      await findExistingItem()
        .then(validate)
        .then(persistDeletedItem)
        .then((result) => resolve(result))
        .catch((error) => {
          reject(error);
        });
    });
    return result;
  }

  /**
   * Get category uuid
   * @param uuid uuid of the category
   * @returns Category
   */
  private async GetCategoryByUuid(uuid: string) {
    let result = new Promise<any>(async (resolve, reject) => {
      await prisma.category
        .findFirst({
          where: {
            uuid: uuid,
            isDeleted: null,
          },
          select: {
            id: true,
          },
        })
        .then((category) => {
          if (category === null) {
            reject(Error(`${uuid} uuid is not an existing category`));
          }

          resolve(category);
        });
    });

    return result;
  }
}
export default ItemServices;
