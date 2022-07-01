import prisma from "../../prisma/client";
import { Prisma, Role, User } from "@prisma/client";
import { PageList } from "../core/pageList";
import { CreateUserDto } from "../dto/user/createUser.dto";
import { UpdateUserDto } from "../dto/user/updateUser.dto";

class UserService {
  /**
   * Get users by searchstring, pagination and filters
   *
   * @param pageList pageList object
   * @param isDeactivated filter for deactivated users
   * @param isDeleted filter for deleted users
   * @param isActive filter for not yet activated users
   * @returns List of User with pagination
   */
  async getUsers(
    pageList: PageList<User>,
    isActive?: Boolean,
    isDeactivated?: Boolean,
    isDeleted?: Boolean
  ) {
    const { searchString, skip, take, orderBy } = pageList;

    // isDeactivated is null -> returns all user
    // isDeactivated is false -> returns all users regardless if deactivated
    // isDeactivated is true -> returns all deactivated users
    const deactivated: Prisma.UserWhereInput =
      isDeactivated == null
        ? {}
        : {
            OR: [
              { isDeactivated: isDeactivated ? true : false },
              { isDeactivated: !isDeactivated ? null : false },
            ],
          };

    // isActive is null -> returns all users
    // isActive is false -> returns all users regardless if activated or not
    // isActive is true -> returns all active users
    const activated: Prisma.UserWhereInput =
      isActive == null
        ? {}
        : {
            OR: [
              { isActive: isActive ? true : false },
              { isActive: !isActive ? null : false },
            ],
          };

    // isDeleted is null -> returns all users
    // isDeleted is false -> returns all users regardless if deleted or not
    // isDeleted is true -> returns all deleted users
    const deleted: Prisma.UserWhereInput =
      isDeleted == null
        ? {}
        : {
            OR: [
              { isDeleted: isDeleted ? true : false },
              { isDeleted: !isDeleted ? null : false },
            ],
          };

    const or: Prisma.UserWhereInput = searchString
      ? {
          OR: [{ email: { contains: searchString as string } }],
        }
      : {};

    const users = await prisma.user.findMany({
      select: {
        email: true,
        userRole: true,
        updatedAt: true,
        updatedBy: true,
        profile: {
          select: {
            firstName: true,
            middleName: true,
            lastName: true,
            sex: true,
            birthDate: true,
            updatedBy: true,
            updatedAt: true,
          },
        },
      },
      where: {
        ...or,
        ...deactivated,
        ...activated,
        ...deleted,
      },
      take: Number(take) || undefined,
      skip: Number(skip) || undefined,
      orderBy: {
        updatedAt: orderBy as Prisma.SortOrder,
      },
    });
    return users;
  }

  /**
   * Get user by uuid
   *
   * @param uuid uuid of the user
   * @returns User
   */
  async getUserByUuid(uuid: string) {
    return await prisma.user.findFirst({
      where: {
        uuid: uuid,
        isDeleted: null,
      },
      select: {
        email: true,
        userRole: true,
        updatedAt: true,
        updatedBy: true,
        profile: {
          select: {
            firstName: true,
            middleName: true,
            lastName: true,
            sex: true,
            birthDate: true,
            updatedBy: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  /**
   * Create a new user
   *
   * @param model CreateuserDto
   */
  async createUser(model: CreateUserDto) {
    let { firstName, middleName, lastName, email, sex, birthDate } = model;
    let persistUser = async () =>
      new Promise<Boolean>(async (resolve, reject) => {
        {
          await prisma.user
            .create({
              data: {
                email,
                createdBy: 1, //TODO: Update to updating user,
                profile: {
                  create: {
                    firstName,
                    middleName,
                    lastName,
                    sex,
                    birthDate,
                    createdBy: 1, //TODO: Update to updating user,
                  },
                },
              },
            })
            .then(() => {
              resolve(true);
            })
            .catch((error) => {
              reject(error);
            });
        }
      });

    let result = new Promise<Boolean>(async (resolve, reject) => {
      await this.isUserExisting(email)
        .then(persistUser)
        .then((result) => resolve(result))
        .catch((error) => {
          reject(error);
        });
    });

    return result;
  }

  /**
   * Update an existing user
   *
   * @param model UpdateUserDto
   */
  async updateUser(model: UpdateUserDto) {
    let persistUpdatedUser = async (user: any) => {
      let { firstName, middleName, lastName, email, sex, birthDate } = model;
      let updatedAt = new Date();
      return new Promise<Boolean>(async (resolve: any, reject: any) => {
        await prisma.user
          .update({
            where: { email: user.email },
            data: {
              email,
              userRole: Role.SYSTEMUSER,
              updatedAt: updatedAt,
              updatedBy: 1, //TODO: Update to updating user
              profile: {
                update: {
                  firstName,
                  middleName,
                  lastName,
                  sex,
                  birthDate,
                  updatedBy: 1, //TODO: Update to updating user
                  updatedAt: updatedAt,
                },
              },
            },
          })
          .then(() => {
            resolve(true);
          })
          .catch((error) => {
            reject(error);
          });
      });
    };
    let validate = (userData: any) => {
      return new Promise((resolve, reject) => {
        if (userData.isDeleted) {
          reject(
            Error(`unable to update ${model.email}, already a deleted user`)
          );
        }
        resolve(userData);
      });
    };
    let findExistingUser = async (model: any) => {
      return new Promise(async (resolve, reject) => {
        await prisma.user
          .findUnique({
            where: { email: model.email },
            select: {
              id: true,
              email: true,
              isDeleted: true,
            },
          })
          .then((existingUser) => {
            resolve(existingUser);
          })
          .catch((error) => reject(error));
      });
    };

    let result = new Promise<Boolean>(async (resolve, reject) => {
      await findExistingUser(model)
        .then(validate)
        .then(persistUpdatedUser)
        .then((result) => resolve(result))
        .catch((error) => {
          reject(error);
        });
    });
    return result;
  }

  /**
   * Delete an existing user
   *
   * @param uuid uuid of the user
   * @returns Boolean
   */
  async deleteUser(uuid: string) {
    let findExistingUser = () => {
      return new Promise<any>(async (resolve, reject) => {
        await prisma.user
          .findUnique({
            where: { uuid: uuid },
            select: {
              id: true,
              isDeleted: true,
            },
          })
          .then((result) => resolve(result))
          .catch((error) => reject(error));
      });
    };

    let validate = (userData: any) => {
      return new Promise((resolve, reject) => {
        if (userData === null) {
          reject(Error(`${uuid} uuid is not an existing user`));
        }
        if (userData.isDeleted) {
          reject(Error(`unable to delete ${uuid}, user is already deleted`));
        }
        resolve(userData);
      });
    };

    let persistDeletedUser = async (userData: any) => {
      return new Promise<Boolean>(async (resolve, reject) => {
        await prisma.user
          .update({
            select: {
              uuid: true,
            },
            where: { id: userData.id },
            data: {
              isDeleted: true,
              deletedBy: 1, //TODO: Update to updating user,
              updatedBy: 1, //TODO: Update to updating user,
              deletedAt: new Date(),
              updatedAt: new Date(),
            },
          })
          .then(() => resolve(true))
          .catch((error) => reject(error));
      });
    };

    let result = new Promise<Boolean>(async (resolve, reject) => {
      await findExistingUser()
        .then(validate)
        .then(persistDeletedUser)
        .then((result) => resolve(result))
        .catch((error) => {
          reject(error);
        });
    });
    return result;
  }

  /**
   * Deactivate an existing user
   *
   * @param uuid uuid of the user
   * @returns
   */
  async deactivateUser(uuid: string) {
    let validate = (userData: any) => {
      return new Promise((resolve, reject) => {
        if (userData === null) {
          reject(Error(`${uuid} uuid is not an existing user`));
        }
        if (userData.isDeactivated) {
          reject(
            Error(`unable to deactivate ${uuid}, user is already deactivated`)
          );
        }
        resolve(userData);
      });
    };

    let persistDeactivatedUser = async (userData: any) => {
      return new Promise<Boolean>(async (resolve, reject) => {
        await prisma.user
          .update({
            select: {
              uuid: true,
            },
            where: { id: userData.id },
            data: {
              isDeactivated: true,
              deactivatedBy: 1, //TODO: Update to updating user,
              deactivatedAt: new Date(),
              updatedAt: new Date(),
            },
          })
          .then(() => resolve(true))
          .catch((error) => reject(error));
      });
    };

    let result = new Promise<Boolean>(async (resolve, reject) => {
      await this.GetUserByUuid(uuid)
        .then(validate)
        .then(persistDeactivatedUser)
        .then((result) => resolve(result))
        .catch((error) => {
          reject(error);
        });
    });
    return result;
  }

  async activateUser(uuid: string) {
    let validate = (userData: any) => {
      return new Promise((resolve, reject) => {
        if (userData === null) {
          reject(Error(`${uuid} uuid is not an existing user`));
        }
        if (!userData.isDeactivated) {
          reject(Error(`unable to activate ${uuid}, user is already activated`));
        }
        resolve(userData);
      });
    };

    let persistActivatedUser = async (userData: any) => {
      return new Promise<Boolean>(async (resolve, reject) => {
        await prisma.user
          .update({
            select: {
              uuid: true,
            },
            where: { id: userData.id },
            data: {
              isDeactivated: false,
              deactivatedBy: 1, //TODO: Update to updating user,
              deactivatedAt: new Date(),
              updatedAt: new Date(),
            },
          })
          .then(() => resolve(true))
          .catch((error) => reject(error));
      });
    };

    let result = new Promise<Boolean>(async (resolve, reject) => {
      await this.GetUserByUuid(uuid)
        .then(validate)
        .then(persistActivatedUser)
        .then((result) => resolve(result))
        .catch((error) => {
          reject(error);
        });
    });
    return result;
  }

  /**
   * Determine if user is existing by email
   * @param email email
   * @returns Boolean
   */
  private async isUserExisting(email: string) {
    let result = new Promise<Boolean>(async (resolve, reject) => {
      await prisma.user
        .findFirst({
          where: {
            email: email,
          },
          select: {
            id: true,
          },
        })
        .then((user) => {
          if (user !== null) {
            reject(Error(`${email} is an existing user`));
          }

          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });

    return result;
  }

  /**
   * Get user by uuid
   * @param uuid  uuid
   * @returns User
   */
  private async GetUserByUuid(uuid: string) {
    let result = new Promise(async (resolve, reject) => {
      await prisma.user
        .findFirst({
          select: {
            id: true,
            isDeactivated: true,
            isActive: true,
            isDeleted: true,
          },
          where: {
            uuid: uuid,
          },
        })
        .then((user) => {
          resolve(user);
        })
        .catch((error) => {
          reject(error);
        });
    });

    return result;
  }

  async initialActivationOfUser(id: string, otp: string) {}
  async sendOtpToUser(id: string) {}
}
export default UserService;
