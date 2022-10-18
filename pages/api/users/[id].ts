import Joi from "joi"
import { getToken } from "next-auth/jwt"
import { createRouter } from "next-connect"

import { authMiddleware } from "@middleware/auth.middleware"
import { validationMiddleware } from "@middleware/validation.middleware"
import { fieldErrorMessages, objectErrorMessages } from "@service/joi"
import { prisma } from "@service/prisma"

import type { NextApiRequest, NextApiResponse } from "next"

export const config = { api: { externalResolver: true } }

const UserIdDto = Joi.object({
   id: Joi
      .string()
      .required()
      .messages(fieldErrorMessages("id"))
}).messages(objectErrorMessages("user create"))

const PatchUserByIdDto = Joi.object({
   name: Joi
      .string()
      .messages(fieldErrorMessages("name")),
   imageUrl: Joi
      .string()
      .messages(fieldErrorMessages("imageUrl")) //TODO From supabase bucket url
   // imageUrl: Joi.string().regex(/^https:\/\/public-web3app\.s3\.eu-north-1\.amazonaws\.com\/(.*)/).allow("").optional(),
}).messages(objectErrorMessages("user create"))

const secret = process.env.NEXTAUTH_SECRET

const router = createRouter<NextApiRequest, NextApiResponse>()

router
   .use(authMiddleware)

   .patch(validationMiddleware({ query: UserIdDto, body: PatchUserByIdDto }), async (req: NextApiRequest, res: NextApiResponse) => {
      try {
         const { id } = req.query
         
         const token = await getToken({
            req,
            secret
         })

         if (!token) return res.status(500).json({ message: "Something went wrong" })
         if (!token.email) return res.status(500).json({ message: "Something went wrong" })

         const user = await prisma.user.findUnique({ where: { email: token.email } })
         if (!user) return res.status(500).json({ message: "Something went wrong" })
         
         if (user.id !== id) return res.status(403).json({ message: "Forbidden" })
         
         const { name, imageUrl } = req.body

         if (typeof id === "string") {
            const user = await prisma.user.findUnique({ where: { id: id }, })
            if (!user) return res.status(404).json({ message: "User not found" })

            await prisma.user.update({
               where: { id: id },
               data: {
                  name,
                  imageUrl
               }
            })

            return res.status(200).json({ message: "User updated successfully" })
         }

      } catch (err) {
         console.error(err.message)
         return res.status(400).json({ message: err.message })
      }
   })

export default router.handler({
   onError: (err: unknown, req: NextApiRequest, res: NextApiResponse) => {
      console.error(err)
      res.status(500).end("Internal server error")
   },
   onNoMatch: (req, res) => {
      res.status(405).end("Method not allowed")
   },
})