import { prisma } from "@service/prisma"

export const config = { runtime: "experimental-edge", }

export default async function handler(): Promise<Response> {

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

      return new Response(
         JSON.stringify(users),
         {
            status: 200,
            headers: { "content-type": "application/json", },
         }
      )

   } catch (err) {
      return new Response(
         JSON.stringify({ message: err.message }),
         {
            status: 400,
            headers: { "content-type": "application/json", },
         }
      )
   }
}