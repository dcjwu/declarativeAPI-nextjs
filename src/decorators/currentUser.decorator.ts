import { createParamDecorator } from "next-api-decorators"

import { getJwtToken } from "@service/nextauth"
import { prisma } from "@service/prisma"

export const CurrentUser = createParamDecorator(
   async req => {
      const token = await getJwtToken(req)
      if (token && token.email) {
         return await prisma.user.findUnique({
            where: { email: token.email },
            select: {
               id: true,
               email: true,
               name: true,
               role: true,
               imageUrl: true,
               createdAt: true,
               updatedAt: true
            }
         })

      } else return null
   }
)