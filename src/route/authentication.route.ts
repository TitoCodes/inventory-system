import express from "express";
import AuthenticationService from "../service/authentication.service";
import errorHandler from "../handler/error.handler";
import { LoginDto } from "../dto/authentication/login.dto";
import Validator from "../middleware/validator";
const router = express.Router();
let authenticationService = new AuthenticationService();

router.post(`/login`, Validator("login"), async (req: any, res: any) => {
  const payload: LoginDto = req.body;

  authenticationService
    .login(payload)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      errorHandler(error, res);
    });
});

export default router;
