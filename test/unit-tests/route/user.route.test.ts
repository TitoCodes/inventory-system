import UserService from "../../../src/service/user.service";
import request from "supertest";
import app from "../../../src/app";
import { CreateUserDto } from "dto/user/createUser.dto";
import { Role, Sex } from "@prisma/client";
import { UpdateUserDto } from "dto/user/updateUser.dto";

let expectedUser: any;
let expectedUsers: any;
let createdAt: Date;
let updatedAt: Date;
let birthDate: Date;
let userUuid: string;

beforeAll(() => {
  createdAt = new Date();
  updatedAt = new Date();
  birthDate = new Date();
  userUuid = "dasd-213-dsada-sada";
  expectedUser = {
    id: 1,
    uuid: "dsad-3213-das213-adsa",
    createdAt: createdAt,
    email: "jhds@mdsa.com",
    updatedBy: null,
    createdBy: 1,
    activatedAt: null,
    otp: null,
    deletedBy: null,
    deactivatedAt: null,
    deactivatedBy: null,
    userAddressId: null,
    userContactId: null,
    userRole: Role.SYSTEMADMIN,
    updatedAt: updatedAt,
    isDeleted: false,
    deletedAt: null,
    isDeactivated: null,
    isActive: null,
    profile: {
      firstName: "Kloy",
      middleName: "D",
      lastName: "Thornson",
      sex: "M",
      birthDate: birthDate,
      updatedBy: null,
      updatedAt: updatedAt,
    },
  };
  expectedUsers = [
    {
      id: 1,
      name: "Sample item",
      description: "Sample item",
      uuid: "dsad-3213-das213-adsa",
      createdAt: createdAt,
      updatedAt: updatedAt,
      isDraft: true,
      deletedAt: null,
      isDeleted: null,
    },
    {
      id: 2,
      name: "Sample item 2",
      description: "Sample item 2",
      uuid: "adsad-3213-das213-adsa",
      createdAt: createdAt,
      updatedAt: updatedAt,
      deletedAt: null,
      isDeleted: null,
      isDraft: false,
    },
    {
      id: 3,
      name: "Sample item 3",
      description: "Sample item 3",
      uuid: "adsad-3213-das213-ljsqw3",
      createdAt: createdAt,
      updatedAt: updatedAt,
      deletedAt: null,
      isDeleted: null,
      isDraft: null,
    },
  ];
});

describe("Get /user", () => {
  test("should return users", async () => {
    jest
      .spyOn(UserService.prototype, "getUsers")
      .mockResolvedValue(expectedUsers);

    let response = await request(app)
      .get("/user")
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
  });

  test("should return status code 400", async () => {
    jest
      .spyOn(UserService.prototype, "getUsers")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .get("/user")
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
  });
});

describe("Get /user:uuid", () => {
  test("should return an item", async () => {
    jest
      .spyOn(UserService.prototype, "getUserByUuid")
      .mockResolvedValue(expectedUser);

    let response = await request(app)
      .get("/user/1")
      .set("Accept", "application/json");

    expect(response.status).toEqual(200);
    expect(response.body.email).toEqual(expectedUser.email);
    expect(response.body.userRole).toEqual(expectedUser.userRole);
    expect(response.body.createdAt).toEqual(
      expectedUser.createdAt.toISOString()
    );
    expect(response.body.updatedAt).toEqual(
      expectedUser.updatedAt.toISOString()
    );
    expect(response.body.updatedBy).toEqual(expectedUser.updatedBy);
    expect(response.body.profile.firstName).toEqual(
      expectedUser.profile.firstName
    );
    expect(response.body.profile.middleName).toEqual(
      expectedUser.profile.middleName
    );
    expect(response.body.profile.lastName).toEqual(
      expectedUser.profile.lastName
    );
    expect(response.body.profile.sex).toEqual(expectedUser.profile.sex);
    expect(response.body.profile.birthDate).toEqual(
      expectedUser.profile.birthDate.toISOString()
    );
    expect(response.body.profile.updatedBy).toEqual(
      expectedUser.profile.updatedBy
    );
    expect(response.body.profile.updatedAt).toEqual(
      expectedUser.profile.updatedAt.toISOString()
    );
  });

  test("should receive status code 400", async () => {
    jest
      .spyOn(UserService.prototype, "getUserByUuid")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .get("/user/1")
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
  });
});

describe("Post /user", () => {
  let createUser: CreateUserDto = {
    firstName: "stephan",
    lastName: "curas",
    middleName: "jef",
    email: "sgteas@email.com",
    sex: Sex.M,
    birthDate: new Date(),
  };

  test("should return status code 201", async () => {
    jest.spyOn(UserService.prototype, "createUser").mockResolvedValue(true);

    let response = await request(app)
      .post("/user")
      .send(createUser)
      .set("Accept", "application/json");

    expect(response.status).toEqual(201);
  });

  test("should return status code 400", async () => {
    jest
      .spyOn(UserService.prototype, "createUser")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .post("/user")
      .send(createUser)
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
  });

  test("should return status code 422 when firstName is not supplied", async () => {
    let { middleName, lastName, email, birthDate, sex } = createUser;
    jest
      .spyOn(UserService.prototype, "createUser")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .post("/user")
      .send({ undefined, middleName, lastName, email, sex, birthDate })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(`\"firstName\" is required`);
  });

  test("should return status code 422 when lastName is not supplied", async () => {
    let { middleName, firstName, email, birthDate, sex } = createUser;
    jest
      .spyOn(UserService.prototype, "createUser")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .post("/user")
      .send({ firstName, middleName, undefined, email, sex, birthDate })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(`\"lastName\" is required`);
  });

  test("should return status code 422 when middleName is not supplied", async () => {
    let { lastName, firstName, email, birthDate, sex } = createUser;
    jest
      .spyOn(UserService.prototype, "createUser")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .post("/user")
      .send({ firstName, undefined, lastName, email, sex, birthDate })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(`\"middleName\" is required`);
  });

  test("should return status code 422 when email is not supplied", async () => {
    let { lastName, firstName, middleName, birthDate, sex } = createUser;
    jest
      .spyOn(UserService.prototype, "createUser")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .post("/user")
      .send({ firstName, middleName, lastName, undefined, sex, birthDate })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(`\"email\" is required`);
  });

  test("should return status code 422 when sex is not supplied", async () => {
    let { lastName, firstName, middleName, birthDate, email } = createUser;
    jest
      .spyOn(UserService.prototype, "createUser")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .post("/user")
      .send({ firstName, middleName, lastName, email, undefined, birthDate })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(
      `\"sex can only be \`M\` or \`F\` value\" is required`
    );
  });
});

describe("Update /user", () => {
  let updateUser: UpdateUserDto = {
    firstName: "stephan",
    lastName: "curas",
    middleName: "jef",
    email: "sgteas@email.com",
    sex: Sex.M,
    birthDate: new Date(),
  };

  test("should return 204 status code", async () => {
    jest.spyOn(UserService.prototype, "updateUser").mockResolvedValue(true);

    let response = await request(app)
      .put("/user")
      .send(updateUser)
      .set("Accept", "application/json");

    expect(response.status).toBe(204);
  });

  test("should return status code 400", async () => {
    jest
      .spyOn(UserService.prototype, "updateUser")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .put("/user")
      .send(updateUser)
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
  });

  test("should return status code 422 when firstName is not supplied", async () => {
    let { middleName, lastName, email, birthDate, sex } = updateUser;
    jest
      .spyOn(UserService.prototype, "createUser")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .post("/user")
      .send({ undefined, middleName, lastName, email, sex, birthDate })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(`\"firstName\" is required`);
  });

  test("should return status code 422 when lastName is not supplied", async () => {
    let { middleName, firstName, email, birthDate, sex } = updateUser;
    jest
      .spyOn(UserService.prototype, "createUser")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .post("/user")
      .send({ firstName, middleName, undefined, email, sex, birthDate })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(`\"lastName\" is required`);
  });

  test("should return status code 422 when middleName is not supplied", async () => {
    let { lastName, firstName, email, birthDate, sex } = updateUser;
    jest
      .spyOn(UserService.prototype, "createUser")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .post("/user")
      .send({ firstName, undefined, lastName, email, sex, birthDate })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(`\"middleName\" is required`);
  });

  test("should return status code 422 when email is not supplied", async () => {
    let { lastName, firstName, middleName, birthDate, sex } = updateUser;
    jest
      .spyOn(UserService.prototype, "createUser")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .post("/user")
      .send({ firstName, middleName, lastName, undefined, sex, birthDate })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(`\"email\" is required`);
  });

  test("should return status code 422 when sex is not supplied", async () => {
    let { lastName, firstName, middleName, birthDate, email } = updateUser;
    jest
      .spyOn(UserService.prototype, "createUser")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .post("/user")
      .send({ firstName, middleName, lastName, email, undefined, birthDate })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(
      `\"sex can only be \`M\` or \`F\` value\" is required`
    );
  });
});

describe("Delete /user:uuid", () => {
  test("should return status code 204", async () => {
    jest.spyOn(UserService.prototype, "deleteUser").mockResolvedValue(true);

    let response = await request(app)
      .delete("/user/1")
      .set("Accept", "application/json");

    expect(response.status).toBe(204);
  });

  test("should return status code 422 when id is not supplied", async () => {
    jest
      .spyOn(UserService.prototype, "deleteUser")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .delete("/user/1")
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
  });
});

describe("Put /user/deactivate/:uuid", () => {
  
  test("should return status code 204", async () => {
    jest.spyOn(UserService.prototype, "deactivateUser")
    .mockResolvedValue(true);

    let response = await request(app)
      .put(`/user/deactivate/${userUuid}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(204);
  });

  test("should return status code 400", async () => {
    jest
      .spyOn(UserService.prototype, "deactivateUser")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .put(`/user/deactivate/${userUuid}`)
      .send()
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
  });
});

describe("Put /user/activate/:uuid", () => {

  test("should return status code 204", async () => {
    jest.spyOn(UserService.prototype, "activateUser")
    .mockResolvedValue(true);

    let response = await request(app)
      .put(`/user/activate/${userUuid}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(204);
  });

  test("should return status code 400", async () => {
    jest
      .spyOn(UserService.prototype, "activateUser")
      .mockRejectedValue(new Error());

    let response = await request(app)
      .put(`/user/activate/${userUuid}`)
      .send()
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
  });
});
