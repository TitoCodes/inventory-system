import express from "express";
import { CreateSupplierDto } from "../dto/supplier/createSupplier.dto";
import errorHandler from "../handler/error.handler";
import SupplierService from "../service/supplier.service";
import { PageList } from "../core/pageList";
import { Supplier } from "@prisma/client";
import { UpdateSupplierDto } from "../dto/supplier/updateSupplier.dto";
import Validator from "../middleware/validator";

const router = express.Router();
let supplierService = new SupplierService();

router.get("/", async (req: any, res: any) => {
  const { searchString, skip, take, orderBy } = req.query;

  await supplierService
    .getSuppliers(
      new PageList<Supplier>(searchString, Number(take), Number(skip), orderBy)
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

  await supplierService
    .getSupplierByUuid(uuid)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      errorHandler(error, res);
    });
});

router.post(
  `/`,
  Validator("createSupplier"),
  async (req: any, res: any) => {
    const payload : CreateSupplierDto = req.body;

    await supplierService
      .createSupplier(payload)
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

  await supplierService
    .deleteSupplier(uuid)
    .then(() => {
      res.status(204).json();
    })
    .catch((error) => {
      errorHandler(error, res);
    });
});

router.put(
  "/:uuid",
  Validator("updateSupplier"),
  async (req: any, res: any) => {
    const { uuid } = req.params;
    const payload: UpdateSupplierDto = req.body;
    payload.uuid = uuid;

    await supplierService
      .updateSupplier(payload)
      .then(() => {
        res.status(204).json();
      })
      .catch((error) => {
        errorHandler(error, res);
      });
  }
);

export default router;
