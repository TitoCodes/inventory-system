import { PrismaClient } from "@prisma/client";
import { mockReset, mockDeep, DeepMockProxy } from "jest-mock-extended";

jest.mock("./client", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

import prisma from "./client";

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
