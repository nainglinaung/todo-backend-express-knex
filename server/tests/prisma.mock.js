const { PrismaClient } = require('@prisma/client');
const { mockDeep, mockReset } = require('jest-mock-extended');
const prisma = require('../database/prismaClient');

// const prisma = require('../prisma/prisma-client');

jest.mock('../database/prismaClient', () => {
  const originalModule = jest.requireActual('../database/prismaClient');
  return {
    __esModule: true,
    ...originalModule,
    default: mockDeep()
  };
});

const prismaMock = prisma;

beforeEach(() => {
  mockReset(prismaMock);
});

module.exports = prismaMock;