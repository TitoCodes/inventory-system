import { LoginDto } from "dto/authentication/login.dto";
import { LoginResultDto } from "dto/authentication/loginResult.dto";
import tokenHelper from "../helper/token.helper";
import prisma from "../../prisma/client";
import bcrypt from "bcrypt";
var jwt = require("jsonwebtoken");

class AuthenticationService {
  /**
   * Login an existing user
   *
   * @param credentials LoginDto
   * @returns LoginResultDto
   */
  async login(credentials: LoginDto): Promise<LoginResultDto> {
    let validate = (user: any) => {
      return new Promise(async (resolve, reject) => {
        if (user === null) {
          reject(Error(`User ${credentials.email} doesn't exist.`));
        }

        let userExistingPasswordHash = user.userSecret?.passwordHash;
        if (
          userExistingPasswordHash === undefined ||
          userExistingPasswordHash === null
        ) {
          reject(Error(`User ${credentials.email} doesn't exist.`));
        }

        let compareResult = bcrypt.compare(
          credentials.password,
          String(userExistingPasswordHash)
        );

        await compareResult.then((match: Boolean) => {
          if (!match) {
            reject(Error(`Old password doesn't match.`));
          }
        });

        resolve(true);
      });
    };

    let createToken = () => {
      return new Promise(async (resolve, reject) => {
        try {
          let audiences = tokenHelper.getAudience();
          let tokenDetails = {
            email: credentials.email,
            aud: audiences,
          };

          resolve(
            jwt.sign(tokenDetails, process.env.PRIVATE_KEY, {
              expiresIn: "1h",
            })
          );
        } catch (error) {
          reject(error);
        }
      });
    };

    let result = new Promise<LoginResultDto>(async (resolve, reject) => {
      await this.findExistingUser(credentials.email)
        .then(validate)
        .then(createToken)
        .then((token: string) => resolve(new LoginResultDto(token)))
        .catch((error) => reject(error));
    });

    return result;
  }

  private async findExistingUser(email: string) {
    return await prisma.user.findUnique({
      select: {
        email: true,
        userSecret: {
          select: {
            passwordHash: true,
          },
        },
      },
      where: { email: String(email) },
    });
  }
}
export default AuthenticationService;
