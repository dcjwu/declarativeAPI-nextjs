import { createHandler, Get, HttpCode, SetHeader } from "next-api-decorators"

import { prisma } from "@service/prisma"

export const config = { runtime: "experimental-edge", }

class UserHandler {
   
   @Get()
   @SetHeader("Cache-Control", "s-maxage=300")
   @HttpCode(200)
   async getAllUsers(): Promise<unknown> {
      return await prisma.user.findMany({
         select: {
            id: true,
            email: true,
            name: true,
            role: true,
            imageUrl: true,
            createdAt: true,
            updatedAt: true
         },
         orderBy: { createdAt: "desc" }
      })
   }
}

export default createHandler(UserHandler)