import express from "express";
import { CreateItemDto } from "../dto/item/createItem.dto";
import { UpdateItemDto } from "../dto/item/updateItem.dto";
import errorHandler from "../handler/error.handler";
import ItemServices from "../service/item.service";
import { PageList } from "../core/pageList";
import { Item } from "@prisma/client";
import Validator from "../middleware/validator";
import { booleanConverter } from "../helper/argumentConverter.helper";

const router = express.Router();
let itemServices = new ItemServices();

router.get("/", async (req: any, res: any) => {
  const { searchString, skip, take, orderBy, isDraft } = req.query;

  await itemServices
    .getItems(
      new PageList<Item>(searchString, Number(take), Number(skip), orderBy),
      booleanConverter(isDraft)
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

  await itemServices
    .getItemByUuid(uuid)
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

router.delete(`/:uuid`, async (req: any, res: any) => {
  const { uuid } = req.params;

  await itemServices
    .deleteItem(uuid)
    .then(() => {
      res.status(204).json();
    })
    .catch((error) => {
      errorHandler(error, res);
    });
});

router.put("/:uuid", Validator("updateItem"), async (req: any, res: any) => {
  const { uuid } = req.params;
  const { name, description, categoryId, isDraft } = req.body;

  await itemServices
    .updateItem(new UpdateItemDto(name, description, categoryId, uuid, isDraft))
    .then(() => {
      res.status(204).json();
    })
    .catch((error) => {
      errorHandler(error, res);
    });
});

export default router;
