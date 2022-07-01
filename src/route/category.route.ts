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

router.get(`/:uuid`, async (req: any, res: any) => {
  const { uuid } = req.params;

  await categoryServices
    .getCategoryByUuid(uuid)
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

router.delete(`/:uuid`, async (req: any, res: any) => {
  const { uuid } = req.params;

  await categoryServices
    .deleteCategory(uuid)
    .then(() => {
      res.status(204).json();
    })
    .catch((error) => {
      errorHandler(error, res);
    });
});

router.put(
  "/:uuid",
  Validator("updateCategory"),
  async (req: any, res: any) => {
    const { uuid } = req.params;
    const { name, description } = req.body;

    await categoryServices
      .updateCategory(new UpdateCategoryDto(name, description, uuid))
      .then(() => {
        res.status(204).json();
      })
      .catch((error) => {
        errorHandler(error, res);
      });
  }
);

export default router;
