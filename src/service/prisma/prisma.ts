import { PrismaClient } from "@prisma/client/edge"

declare global {
   // allow global `var` declarations
   // eslint-disable-next-line no-var
   var prisma: PrismaClient | undefined
}

export const prisma: PrismaClient =
   global.prisma ||
   new PrismaClient({ log: ["query"], })

if (process.env.NODE_ENV !== "production") global.prisma = prisma