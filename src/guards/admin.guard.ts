import { createMiddlewareDecorator, ForbiddenException, UnauthorizedException } from "next-api-decorators"

import { getJwtToken } from "@service/nextauth"
import { prisma } from "@service/prisma"

import type { NextApiRequest, NextApiResponse } from "next"
import type { NextFunction } from "next-api-decorators"

export const AdminGuard = createMiddlewareDecorator(
   async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
      const token = await getJwtToken(req)
      if (!token) throw new UnauthorizedException()
      
      if (token && token.email) {
         const user = await prisma.user.findUnique({ where: { email: token.email } })
         if (user && user.role === "ADMIN") {
            next()

         } else throw new ForbiddenException()
      }
   })