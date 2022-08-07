import { prismaMock } from "../../../prisma/singleton";
import { PageList } from "../../../src/core/pageList";
import { Role, Sex } from "@prisma/client";
import UserService from "../../../src/service/user.service";
import { CreateUserDto } from "dto/user/createUser.dto";
import { SignUpDto } from "dto/user/signUp.dto";

let userService: UserService;
let expectedUser: any;
let expectedUsers: any;
let createdAt: Date;
let updatedAt: Date;
let birthDate: Date;
let userUuid: string;

beforeAll(() => {
  userService = new UserService();
  createdAt = new Date();
  updatedAt = new Date();
  birthDate = new Date();
  userUuid = "dasd-213-dsada-sada";
  expectedUser = {
    id: 1,
    uuid: "dsad-3213-das213-adsa",
    createdAt: createdAt,
    email: "sgteas@email.com",
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
      firstName: "Active",
      lastName: "user",
      middleName: "L",
      uuid: "dsad-3213-das213-adsa",
      createdAt: createdAt,
      updatedAt: updatedAt,
      isDeactivated: null,
      isActive: true,
      deletedAt: null,
      isDeleted: null,
      email: "active@user.com",
    },
    {
      id: 2,
      firstName: "Deleted",
      lastName: "User",
      middleName: "Ls",
      uuid: "dsad-3213-das213-asddsa",
      createdAt: createdAt,
      updatedAt: updatedAt,
      isDeactivated: null,
      isActive: null,
      deletedAt: null,
      isDeleted: true,
      email: "deleted@user.com",
    },
    {
      id: 3,
      firstName: "Deactivated",
      lastName: "User",
      middleName: "Ls",
      uuid: "dsad-3213-das213s-adsa",
      createdAt: createdAt,
      updatedAt: updatedAt,
      isDeactivated: true,
      isActive: true,
      deletedAt: null,
      isDeleted: null,
      email: "deactivated@user.com",
    },
  ];
});

describe("Create user", () => {
  let createUser: CreateUserDto = {
    firstName: "stephan",
    lastName: "curas",
    middleName: "jef",
    email: "sgteas@email.com",
    sex: Sex.M,
    birthDate: new Date(),
  };

  test("should create a new user", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue(expectedUser);

    await userService.createUser(createUser).then((result) => {
      expect(result).toBe(true);
    });
  });

  test("should throw an error existing user", async () => {
    prismaMock.user.findUnique.mockResolvedValue(expectedUser);
    prismaMock.user.create.mockResolvedValue(expectedUser);

    await expect(userService.createUser(createUser)).rejects.toThrowError(
      `${expectedUser.email} is an existing user`
    );
  });

  test("should throw error from prisma.create", async () => {
    let error = new Error(`Something went wrong`);
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockRejectedValue(error);

    await expect(userService.createUser(createUser)).rejects.toThrowError(
      `Something went wrong`
    );
  });

  test("should throw error from prisma.findUnique", async () => {
    let error = new Error(`Something went wrong`);
    prismaMock.user.findUnique.mockRejectedValue(error);

    await expect(userService.createUser(createUser)).rejects.toThrowError(
      `Something went wrong`
    );
  });
});

describe("Update user", () => {
  test("should update an existing user", async () => {
    prismaMock.user.findUnique.mockResolvedValue(expectedUser);
    prismaMock.user.update.mockResolvedValue(expectedUser);

    let result = await userService.updateUser(expectedUser);
    expect(result).toBe(true);
  });

  test("should throw user is not existing error", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.update.mockResolvedValue(expectedUser);

    await expect(userService.updateUser(expectedUser)).rejects.toThrowError(
      `${expectedUser.email} is not an existing user`
    );
  });

  test("should throw error when trying to update already deleted user", async () => {
    expectedUser.isDeleted = true;
    prismaMock.user.findUnique.mockResolvedValue(expectedUser);
    prismaMock.user.update.mockResolvedValue(expectedUser);

    await expect(userService.updateUser(expectedUser)).rejects.toThrowError(
      `unable to update ${expectedUser.email}, already a deleted user`
    );
  });

  test("should throw error from prisma.create", async () => {
    let error = new Error(`Something went wrong`);
    prismaMock.user.findUnique.mockResolvedValue(expectedUsers);
    prismaMock.user.update.mockRejectedValue(error);

    await expect(userService.updateUser(expectedUsers)).rejects.toThrowError(
      `Something went wrong`
    );
  });

  test("should throw error from prisma.findUnique", async () => {
    let error = new Error(`Something went wrong`);
    prismaMock.user.findUnique.mockRejectedValue(error);

    await expect(userService.updateUser(expectedUsers)).rejects.toThrowError(
      `Something went wrong`
    );
  });
});

describe("Delete user", () => {
  test("should delete a user", async () => {
    expectedUser.isDeleted = false;
    prismaMock.user.findUnique.mockResolvedValue(expectedUser);
    prismaMock.user.update.mockResolvedValue(expectedUser);

    let result = await userService.deleteUser(expectedUser.uuid);
    expect(result).toBe(true);
  });

  test("should throw error when trying to delete already deleted user", async () => {
    expectedUser.isDeleted = true;
    prismaMock.user.findUnique.mockResolvedValue(expectedUser);
    prismaMock.user.update.mockResolvedValue(expectedUser);

    await expect(
      userService.deleteUser(expectedUser.uuid)
    ).rejects.toThrowError(
      `unable to delete ${expectedUser.uuid}, user is already deleted`
    );
  });
  test("should throw not existing error", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(
      userService.deleteUser(expectedUser.uuid)
    ).rejects.toThrowError(`${expectedUser.uuid} uuid is not an existing user`);
  });

  test("should throw error from prisma.findUnique", async () => {
    let error = new Error(`Something went wrong`);
    prismaMock.user.findUnique.mockRejectedValue(error);

    await expect(
      userService.deleteUser(expectedUsers.uuid)
    ).rejects.toThrowError(`Something went wrong`);
  });

  test("should throw error from prisma.delete", async () => {
    let error = new Error(`Something went wrong`);
    prismaMock.user.findUnique.mockResolvedValue(expectedUsers);
    prismaMock.user.update.mockRejectedValue(error);

    await expect(
      userService.deleteUser(expectedUser.uuid)
    ).rejects.toThrowError(`Something went wrong`);
  });
});

describe("Get user by uuid", () => {
  test("retrieve user by id", async () => {
    let userId = "40c05336-daa7-439c-b1b4-e7f8f9c9cac0";
    prismaMock.user.findFirst.mockResolvedValue(expectedUser);

    await expect(userService.getUserByUuid(userId)).resolves.toEqual(
      expectedUser
    );
  });
});

describe("Get users", () => {
  test("retrieve users", async () => {
    prismaMock.user.findMany.mockResolvedValue(expectedUsers);

    let result = await userService.getUsers(
      new PageList("", undefined, undefined, undefined)
    );
    expect(result.length).toBe(3);
  });

  test("retrieve users with searchstring", async () => {
    prismaMock.user.findMany.mockResolvedValue(expectedUsers);

    let result = await userService.getUsers(
      new PageList("user", undefined, undefined, undefined)
    );
    expect(result.length).toBe(3);
  });

  test("retrieve users which is active", async () => {
    prismaMock.user.findMany.mockResolvedValue(expectedUsers);

    let result = await userService.getUsers(
      new PageList("sample", undefined, undefined, undefined),
      true
    );
    expect(result.length).toBe(3);
  });

  test("retrieve users which is deactivated", async () => {
    prismaMock.user.findMany.mockResolvedValue(expectedUsers);

    let result = await userService.getUsers(
      new PageList("sample", undefined, undefined, undefined),
      false,
      true
    );
    expect(result.length).toBe(3);
  });

  test("retrieve users which is deleted", async () => {
    prismaMock.user.findMany.mockResolvedValue(expectedUsers);

    let result = await userService.getUsers(
      new PageList("sample", undefined, undefined, undefined),
      false,
      false,
      true
    );
    expect(result.length).toBe(3);
  });
});

describe("Deactivate user", () => {
  test("should deactivate a user", async () => {
    prismaMock.user.findUnique.mockResolvedValue(expectedUser);
    prismaMock.user.update.mockResolvedValue(expectedUser);

    let result = await userService.deactivateUser(expectedUser.uuid);
    expect(result).toBe(true);
  });

  test("should throw not existing error", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(
      userService.deactivateUser(expectedUser.uuid)
    ).rejects.toThrowError(`${expectedUser.uuid} uuid is not an existing user`);
  });

  test("should throw user is already deactivated error", async () => {
    expectedUser.isDeactivated = true;
    prismaMock.user.findUnique.mockResolvedValue(expectedUser);

    await expect(
      userService.deactivateUser(expectedUser.uuid)
    ).rejects.toThrowError(
      `unable to deactivate ${expectedUser.uuid}, user is already deactivated`
    );
  });

  test("should throw error from prisma.findUnique", async () => {
    let error = new Error(`Something went wrong`);
    prismaMock.user.findUnique.mockRejectedValue(error);

    await expect(
      userService.deactivateUser(expectedUsers.uuid)
    ).rejects.toThrowError(`Something went wrong`);
  });

  test("should throw error from prisma.update", async () => {
    expectedUser.isDeactivated = false;
    let error = new Error(`Something went wrong`);
    prismaMock.user.findUnique.mockResolvedValue(expectedUser);
    prismaMock.user.update.mockRejectedValue(error);

    await expect(
      userService.deactivateUser(expectedUsers.uuid)
    ).rejects.toThrowError(`Something went wrong`);
  });
});

describe("Activate user", () => {
  test("should activate a user", async () => {
    expectedUser.isDeactivated = true;
    prismaMock.user.findUnique.mockResolvedValue(expectedUser);
    prismaMock.user.update.mockResolvedValue(expectedUser);

    let result = await userService.activateUser(expectedUser.uuid);
    expect(result).toBe(true);
  });

  test("should throw not existing error", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(
      userService.activateUser(expectedUser.uuid)
    ).rejects.toThrowError(`${expectedUser.uuid} uuid is not an existing user`);
  });

  test("should throw user is already eactivated error", async () => {
    expectedUser.isDeactivated = false;
    prismaMock.user.findUnique.mockResolvedValue(expectedUser);

    await expect(
      userService.activateUser(expectedUser.uuid)
    ).rejects.toThrowError(
      `unable to activate ${expectedUser.uuid}, user is already activated`
    );
  });

  test("should throw error from prisma.findUnique", async () => {
    expectedUser.isDeactivated = true;
    let error = new Error(`Something went wrong`);
    prismaMock.user.findUnique.mockRejectedValue(error);

    await expect(
      userService.activateUser(expectedUsers.uuid)
    ).rejects.toThrowError(`Something went wrong`);
  });

  test("should throw error from prisma.update", async () => {
    let error = new Error(`Something went wrong`);
    prismaMock.user.findUnique.mockResolvedValue(expectedUser);
    prismaMock.user.update.mockRejectedValue(error);

    await expect(
      userService.activateUser(expectedUsers.uuid)
    ).rejects.toThrowError(`Something went wrong`);
  });
});

describe("Sign Up user", () => {
  let signUpUser: SignUpDto = {
    email: "test@email.com",
    password: "somePas@sa21s",
  };

  test("should sign up a new user", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue(expectedUser);
    let result = await userService.signUp(signUpUser);
    expect(result).toBe(true);
  });

  test("should throw not existing error", async () => {
    prismaMock.user.findUnique.mockResolvedValue(expectedUser);

    await expect(userService.signUp(signUpUser)).rejects.toThrowError(
      `${signUpUser.email} is an existing user`
    );
  });

  test("should throw error from prisma.create", async () => {
    
    let error = new Error(`Something went wrong`);
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockRejectedValue(error);

    await expect(
      userService.signUp(signUpUser)
    ).rejects.toThrowError(`Something went wrong`);
  });
});
