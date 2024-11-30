// FILE: server/database/prismaClient.js
const { PrismaClient } = require('@prisma/client');
const { mockDeep } = require('jest-mock-extended');

let prisma;

if (process.env.NODE_ENV === 'test') {
  prisma = mockDeep();
} else {
  prisma = new PrismaClient();
}

module.exports = prisma;