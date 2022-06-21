import { Category, Prisma, PrismaClient } from "@prisma/client";
import { PageList } from "../core/pageList";
import { UpdateCategoryDto } from "../dto/category/updateCategory.dto";
import { CreateCategoryDto } from "../dto/category/createCategory.dto";

const prisma = new PrismaClient();

const getCategories = async (pageList: PageList<Category>) => {
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
      isDeleted:null
    },
    take: Number(take) || undefined,
    skip: Number(skip) || undefined,
    orderBy: {
      updatedAt: orderBy as Prisma.SortOrder,
    },
  });
  return categories;
};

const getCategoryByid = async (id: string) => {
  const category = await prisma.category.findFirst({
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

  return category;
};

const createCategory = async (model: CreateCategoryDto) => {
  let { name, description } = model;

  const category = await prisma.category.findUnique({
    where: { name: String(name) },
  });

  if (category !== null) {
    throw Error(`Category name ${category.name} already exist.`);
  }

  await prisma.category.create({
    data: {
      name,
      description,
    },
  });

  return true;
};

const updateCategory = async (model: UpdateCategoryDto) => {
  const categoryData = await prisma.category.findUnique({
    where: { uuid: model.uuid },
    select: {
      id: true,
    },
  });

  if (categoryData === null) {
    throw Error(`${model.uuid} id is not an existing category`);
  }

  const updatedcategory = await prisma.category.update({
    select: {
      uuid: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
    where: { id: categoryData.id || undefined },
    data: {
      name: model.name,
      description: model.description,
      updatedAt: new Date(),
    },
  });

  return updatedcategory;
};

const deleteCategory = async (id: string) => {
  const categoryData = await prisma.category.findUnique({
    where: { uuid: id },
    select: {
      id: true,
    },
  });

  if (categoryData === null) {
    throw Error(`${id} id is not an existing category`);
  }

  await prisma.category.update({
    select: {
      uuid: true,
    },
    where: { id: categoryData.id || undefined },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return true;
};

export default {
  getCategories,
  getCategoryByid,
  createCategory,
  updateCategory,
  deleteCategory,
};
