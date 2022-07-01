import { Sex } from "@prisma/client";

export class CreateUserDto {
  constructor(
    public firstName: string,
    public middleName: string,
    public lastName: string,
    public email: string,
    public sex: Sex,
    public birthDate: Date
  ) {}
}
