import { NextResponse } from "next/server"

import { prisma } from "@service/prisma"

export const config = { runtime: "experimental-edge", }

export default async function handler(): Promise<NextResponse> {

   try {
      const users = await prisma.user.findMany({
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
      
      return NextResponse.json(users, { status: 200, headers: { "Cache-Control": "s-maxage=300" } })

   } catch (err) {
      return NextResponse.json({ message: err.message }, { status: 400 })
   }
}