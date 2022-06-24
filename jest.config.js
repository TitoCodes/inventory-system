module.exports = {
    clearMocks: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout:40000,
    setupFilesAfterEnv: ['<rootDir>/prisma/singleton.ts'],
  }