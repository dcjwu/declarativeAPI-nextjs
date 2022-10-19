import Joi from "joi"
import { createRouter } from "next-connect"

import { adminMiddleware } from "@middleware/admin.middleware"
import { validationMiddleware } from "@middleware/validation.middleware"
import { fieldErrorMessages, objectErrorMessages, } from "@service/joi"
import { prisma } from "@service/prisma"

import type { NextApiRequest, NextApiResponse } from "next"

const bcrypt = require("bcrypt") // eslint-disable-line @typescript-eslint/no-var-requires

const PostUserDto = Joi.object({
   name: Joi
      .string()
      .required()
      .messages(fieldErrorMessages("name")),
   email: Joi
      .string()
      .email()
      .required()
      .messages(fieldErrorMessages("email")),
   password: Joi
      .string()
      .min(8)
      .required()
      .messages(fieldErrorMessages("password", 8)),
   imageUrl: Joi
      .string()
      .messages(fieldErrorMessages("imageUrl"))//TODO From supabase bucket url
}).messages(objectErrorMessages("user create"))

const router = createRouter<NextApiRequest, NextApiResponse>()

router
   .use(adminMiddleware)

   .get(async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
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

         return res.status(200).json(users)

      } catch (err) {
         return res.status(400).json({ message: err.message })
      }
   })

   .post(validationMiddleware({ body: PostUserDto }), async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      const { name, email, password, imageUrl } = req.body
      
      try {
         const user = await prisma.user.findUnique({ where: { email: email } })
         if (user) return res.status(409).json({ message: "User with such email already exists" })
         
         const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

         await prisma.user.create({
            data: {
               email,
               password: passwordHash,
               name,
               imageUrl
            }
         })
         
         return res.status(201).json({ message: `User with email ${email} successfully created` })

      } catch (err) {
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