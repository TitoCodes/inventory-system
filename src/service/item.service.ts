import prisma from "../../prisma/client";
import { Item, Prisma } from "@prisma/client";
import { PageList } from "../core/pageList";
import { CreateItemDto } from "../dto/item/createItem.dto";
import { UpdateItemDto } from "../dto/item/updateItem.dto";

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
   * @param id uuid of the item
   * @returns Item
   */
  async getItemByid(id: string) {
    return await prisma.item.findFirst({
      where: {
        uuid: id,
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

    await this.getCategoryByUuid(categoryId).then(async (category) => {
      await prisma.item.create({
        data: {
          name,
          description,
          categoryId: category.id,
          isDraft,
        },
      });

      return true;
    });
  }

  /**
   * Update an existing item
   * 
   * @param model UpdateItemDto
   */
  async updateItem(model: UpdateItemDto) {
    const itemData = await prisma.item.findUnique({
      where: { uuid: model.uuid },
      select: {
        id: true,
      },
    });

    if (itemData === null) {
      throw Error(`${model.uuid} id is not an existing item`);
    }

    await this.getCategoryByUuid(model.categoryId).then(async (category) => {
      await prisma.item.update({
        select: {
          uuid: true,
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
        where: { id: itemData.id },
        data: {
          name: model.name,
          description: model.description,
          updatedAt: new Date(),
          isDraft: model.isDraft,
          categoryId: category.id,
        },
      });
      return;
    });
  }

  /**
   * Delete an item
   * 
   * @param id uuid of the item
   * @returns Boolean
   */
  async deleteItem(id: string) {
    const itemData = await prisma.item.findUnique({
      where: { uuid: id },
      select: {
        id: true,
      },
    });

    if (itemData === null) {
      throw Error(`${id} id is not an existing item`);
    }

    await prisma.item.update({
      select: {
        uuid: true,
      },
      where: { id: itemData.id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return true;
  }

  /**
   * Get category id
   * @param uuid uuid of the category
   * @returns Category
   */
  private async getCategoryByUuid(uuid: string) {
    let category = await prisma.category.findFirst({
      where: {
        uuid: uuid,
        isDeleted: null,
      },
      select: {
        id: true,
      },
    });

    if (category === null) {
      throw Error(`${uuid} id  is not an existing category`);
    }

    return category;
  }
}
export default ItemServices;
