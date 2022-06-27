import express from "express";
import { CreateCategoryDto } from "../dto/category/createCategory.dto";
import errorHandler from "../handler/error.handler";
import CategoryServices from "../service/category.service";
import { PageList } from "../core/pageList";
import { Category } from "@prisma/client";
import { UpdateCategoryDto } from "../dto/category/updateCategory.dto";
import Validator from "../middleware/validator";

const router = express.Router();
let categoryServices = new CategoryServices();

router.get("/", async (req: any, res: any) => {
  const { searchString, skip, take, orderBy } = req.query;

  await categoryServices
    .getCategories(
      new PageList<Category>(searchString, Number(take), Number(skip), orderBy)
    )
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      errorHandler(error, res);
    });
});

router.get(`/:id`, async (req: any, res: any) => {
  const { id } = req.params;

  await categoryServices
    .getCategoryByid(id)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      errorHandler(error, res);
    });
});

router.post(
  `/`,
  Validator("createCategory"),
  async (req: any, res: any) => {
    const { name, description } = req.body;

    await categoryServices
      .createCategory(new CreateCategoryDto(name, description))
      .then(() => {
        res.status(201).json();
      })
      .catch((error) => {
        errorHandler(error, res);
      });
  }
);

router.delete(`/:id`, async (req: any, res: any) => {
  const { id } = req.params;

  await categoryServices
    .deleteCategory(id)
    .then(() => {
      res.status(204).json();
    })
    .catch((error) => {
      errorHandler(error, res);
    });
});

router.put(
  "/:id",
  Validator("updateCategory"),
  async (req: any, res: any) => {
    const { id } = req.params;
    const { name, description } = req.body;

    await categoryServices
      .updateCategory(new UpdateCategoryDto(name, description, id))
      .then(() => {
        res.status(204).json();
      })
      .catch((error) => {
        errorHandler(error, res);
      });
  }
);

export default router;
