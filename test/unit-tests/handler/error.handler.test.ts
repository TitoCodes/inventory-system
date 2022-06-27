import { TokenExpiredError } from "jsonwebtoken";
import errorHandler from "../../../src/handler/error.handler";

let res: any;
describe("Error handler", () => {
  beforeAll(() => {
    res = {
      status: jest.fn().mockImplementation(() => {
        return res;
      }),
      json: jest.fn(),
    };
  });

  test("should return status code 401 when token is expired", () => {
    errorHandler(new TokenExpiredError(`token expired`, new Date()), res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized Access" });
  });

  test("should return status code 401 when token is unauthorized", () => {
    let error = new Error();
    error.name = "UnauthorizedError";
    errorHandler(error, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized Access" });
  });

  test("should return status code 500 as default error", () => {
    let error = new Error();
    error.name = "Unhandled error";
    error.message = "Unknown error";
    errorHandler(error, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
  });
});
