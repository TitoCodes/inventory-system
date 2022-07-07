import AuthenticationService from "../../../src/service/authentication.service";
import request from "supertest";
import app from "../../../src/app";
import { LoginResultDto } from "../../../src/dto/authentication/loginResult.dto";
import { LoginDto } from "../../../src/dto/authentication/login.dto";

let expectedResult: LoginResultDto;

beforeAll(() => {
  expectedResult = {
    accessToken: "dsadasd.asd3213k123.dasdassdas",
  };
});

describe("Post /login", () => {
  let credentials = new LoginDto("something@test.com", "sdasda");
  test("should return accessToken", async () => {
    jest
      .spyOn(AuthenticationService.prototype, "login")
      .mockResolvedValue(expectedResult);

    let response = await request(app)
      .post("/login")
      .send(credentials)
      .set("Accept", "application/json");

    expect(response.status).toEqual(200);
    expect(response.body.accessToken).toEqual(expectedResult.accessToken);
  });

  test("should return status code 400", async () => {
    jest
      .spyOn(AuthenticationService.prototype, "login")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .post("/login")
      .send(credentials)
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
  });

  test("should return status code 422 when email is not supplied", async () => {
    const { password, email } = credentials;
    jest
      .spyOn(AuthenticationService.prototype, "login")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .post("/login")
      .send({ undefined, password })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(`\"email\" is required`);
  });

  test("should return status 422 code when password is not supplied", async () => {
    const { password, email } = credentials;
    jest
      .spyOn(AuthenticationService.prototype, "login")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .post("/login")
      .send({ email, undefined })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(`\"password\" is required`);
  });
});
