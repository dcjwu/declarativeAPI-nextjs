import { UnauthorizedException } from "next-api-decorators"

import { getJwtToken } from "@service/nextauth"

import type { NextApiRequest, NextApiResponse } from "next"
import type { NextFunction } from "next-api-decorators"

export const AuthMiddleware = async (req: NextApiRequest, res: NextApiResponse, next: NextFunction): Promise<void> => {
   const token = await getJwtToken(req)
   if (!token) throw new UnauthorizedException()

   next()
}