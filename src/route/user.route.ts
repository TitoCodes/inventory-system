import express from "express";
import { CreateUserDto } from "../dto/user/createUser.dto";
import { UpdateUserDto } from "../dto/user/updateUser.dto";
import errorHandler from "../handler/error.handler";
import UserServices from "../service/user.service";
import { PageList } from "../core/pageList";
import { User } from "@prisma/client";
import Validator from "../middleware/validator";
import { booleanConverter } from "../helper/argumentConverter.helper";

const router = express.Router();
let userServices = new UserServices();

router.get("/", async (req: any, res: any) => {
  const {
    searchString,
    skip,
    take,
    orderBy,
    isDeactivated,
    isActive,
    isDeleted,
  } = req.query;

  await userServices
    .getUsers(
      new PageList<User>(searchString, Number(take), Number(skip), orderBy),
      booleanConverter(isActive),
      booleanConverter(isDeactivated),
      booleanConverter(isDeleted)
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

  await userServices
    .getUserByUuid(uuid)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      errorHandler(error, res);
    });
});

router.post(`/`, Validator("createUser"), async (req: any, res: any) => {
  const user : CreateUserDto = req.body ;

  await userServices
    .createUser(
      user
    )
    .then(() => {
      res.status(201).json();
    })
    .catch((error) => {
      errorHandler(error, res);
    });
});

router.delete(`/:uuid`, async (req: any, res: any) => {
  const { uuid } = req.params;

  await userServices
    .deleteUser(uuid)
    .then(() => {
      res.status(204).json();
    })
    .catch((error) => {
      errorHandler(error, res);
    });
});

router.put(`/deactivate/:uuid`, async (req: any, res: any) => {
  const { uuid } = req.params;

  await userServices
    .deactivateUser(uuid)
    .then(() => {
      res.status(204).json();
    })
    .catch((error) => {
      errorHandler(error, res);
    });
});

router.put(`/activate/:uuid`, async (req: any, res: any) => {
  const { uuid } = req.params;

  await userServices
    .activateUser(uuid)
    .then(() => {
      res.status(204).json();
    })
    .catch((error) => {
      errorHandler(error, res);
    });
});

router.put("/", Validator("updateUser"), async (req: any, res: any) => {
  const user : UpdateUserDto = req.body;

  await userServices
    .updateUser(
     user
    )
    .then(() => {
      res.status(204).json();
    })
    .catch((error) => {
      errorHandler(error, res);
    });
});

export default router;
