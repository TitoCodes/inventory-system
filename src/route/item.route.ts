import express from "express";
import { CreateItemDto } from "../dto/item/createItem.dto";
import { UpdateItemDto } from "../dto/item/updateItem.dto";
import errorHandler from "../handler/error.handler";
import ItemServices from "../service/item.service";
import { PageList } from "../core/pageList";
import { Item } from "@prisma/client";
import Validator from "../middleware/validator";

const router = express.Router();
let itemServices = new ItemServices();

router.get("/", async (req: any, res: any) => {
  const { searchString, skip, take, orderBy, isDraft } = req.query;

  await itemServices
    .getItems(
      new PageList<Item>(searchString, Number(take), Number(skip), orderBy),
      isDraft != null ? JSON.parse(isDraft) : null
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

  await itemServices
    .getItemByid(id)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      errorHandler(error, res);
    });
});

router.post(`/`, Validator("createItem"), async (req: any, res: any) => {
  const { name, description, categoryId, isDraft } = req.body;

  await itemServices
    .createItem(new CreateItemDto(name, description, categoryId, isDraft))
    .then(() => {
      res.status(201).json();
    })
    .catch((error) => {
      errorHandler(error, res);
    });
});

router.delete(`/:id`, async (req: any, res: any) => {
  const { id } = req.params;

  await itemServices
    .deleteItem(id)
    .then(() => {
      res.status(204).json();
    })
    .catch((error) => {
      errorHandler(error, res);
    });
});

router.put("/:id", Validator("updateItem"), async (req: any, res: any) => {
  const { id } = req.params;
  const { name, description, categoryId, isDraft } = req.body;

  await itemServices
    .updateItem(new UpdateItemDto(name, description, categoryId, id, isDraft))
    .then(() => {
      res.status(204).json();
    })
    .catch((error) => {
      errorHandler(error, res);
    });
});

export default router;
