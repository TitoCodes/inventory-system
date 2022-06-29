import prisma from "../../prisma/client";
import { Category, Prisma } from "@prisma/client";
import { PageList } from "../core/pageList";
import { UpdateCategoryDto } from "../dto/category/updateCategory.dto";
import { CreateCategoryDto } from "../dto/category/createCategory.dto";

class CategoryServices {
  /**
   * Get categories by searchstring and pagination
   *
   * @param pageList pageList object
   * @returns List of Categories with pagination
   */
  async getCategories(pageList: PageList<Category>) {
    const { searchString, skip, take, orderBy } = pageList;

    const or: Prisma.CategoryWhereInput = searchString
      ? {
          OR: [
            { name: { contains: searchString as string } },
            { description: { contains: searchString as string } },
          ],
        }
      : {};

    const categories = await prisma.category.findMany({
      select: {
        uuid: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
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
    return categories;
  }

  /**
   * Get category by uuid
   * @param id uuid of the category
   * @returns Category
   */
  async getCategoryByid(id: string) {
    return await prisma.category.findFirst({
      where: {
        uuid: id,
        isDeleted: null,
      },
      select: {
        name: true,
        description: true,
        updatedAt: true,
        createdAt: true,
        uuid: true,
      },
    });
  }

  /**
   * Create a new category
   *
   * @param model CreateCategoryDto
   * @returns Boolean
   */
  async createCategory(model: CreateCategoryDto) {
    let { name, description } = model;

    let ensureCategoryNameIsUnique = async () => {
      return new Promise(async (resolve, reject) => {
        await prisma.category
          .findUnique({
            where: { name: String(name) },
          })
          .then((category) => {
            if (category !== null) {
              reject(Error(`Category name ${category.name} already exist.`));
            }
            resolve(category);
          })
          .catch((error) => reject(error));
      });
    };

    let persistCategory = async () => {
      return new Promise<Boolean>(async (resolve, reject) => {
        await prisma.category
          .create({
            data: {
              name,
              description,
            },
          })
          .then(() => {
            resolve(true);
          })
          .catch((error) => reject(error));
      });
    };

    let result = new Promise<Boolean>(async (resolve, reject) => {
      await ensureCategoryNameIsUnique()
        .then(persistCategory)
        .then(() => {
          resolve(true);
        })
        .catch((error) => reject(error));
    });

    return result;
  }

  /**
   * Update an existing category
   *
   * @param model UpdateCategoryDto
   * @returns Boolean
   */
  async updateCategory(model: UpdateCategoryDto) {
    let persistUpdatedCategory = async (category: any) => {
      return new Promise<any>(async (resolve, reject) => {
        await prisma.category
          .update({
            select: {
              uuid: true,
              name: true,
              description: true,
              createdAt: true,
              updatedAt: true,
            },
            where: { id: category.id },
            data: {
              name: model.name,
              description: model.description,
              updatedAt: new Date(),
            },
          })
          .then((result) => resolve(result))
          .catch((error) => reject(error));
      });
    };
    let result = new Promise<any>(async (resolve, reject) => {
      await this.findExistingCategory(model.uuid)
        .then(persistUpdatedCategory)
        .then((result) => resolve(result))
        .catch((error) => {
          reject(error);
        });
    });

    return result;
  }

  /**
   * Delete a category
   *
   * @param id uuid of the category
   * @returns Boolean
   */
  async deleteCategory(id: string) {
    let persistDeletedCategory = async (category) => {
      return new Promise<Boolean>(async (resolve, reject) => {
        await prisma.category
          .update({
            select: {
              uuid: true,
            },
            where: { id: category.id },
            data: {
              isDeleted: true,
              deletedAt: new Date(),
              updatedAt: new Date(),
            },
          })
          .then((result) => resolve(true))
          .catch((error) => reject(error));
      });
    };
    
    let result = new Promise<Boolean>(async (resolve, reject) => {
      await this.findExistingCategory(id)
        .then(persistDeletedCategory)
        .then((result) => resolve(result))
        .catch((error) => {
          reject(error);
        });
    });
    return result;
  }

  private async findExistingCategory (id:string) {
    return new Promise(async (resolve, reject) => {
      await prisma.category
        .findUnique({
          where: { uuid: id },
          select: {
            id: true,
          },
        })
        .then((category) => {
          if (category === null) {
            reject(Error(`${id} id is not an existing category`));
          }
          resolve(category);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
export default CategoryServices;
