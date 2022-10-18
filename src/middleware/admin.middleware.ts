import { getToken } from "next-auth/jwt"

import { prisma } from "@service/prisma"

import type { NextApiRequest, NextApiResponse } from "next"
import type { NextHandler } from "next-connect"
import type { NextResponse } from "next/server"

const secret = process.env.NEXTAUTH_SECRET

export const adminMiddleware = async (req: NextApiRequest, res: NextApiResponse, next: NextHandler): Promise<void | NextResponse> => {
   const token = await getToken({
      req,
      secret
   })
   if (!token) return res.status(401).json({ message: "Unauthorized" })
   if (!token.email) return res.status(401).json({ message: "Unauthorized" })
   
   const user = await prisma.user.findUnique({ where: { email: token.email } })
   if (!user) return res.status(401).json({ message: "Unauthorized" })

   if (user.role !== "ADMIN") return res.status(403).json({ message: "Forbidden" })

   next()
}