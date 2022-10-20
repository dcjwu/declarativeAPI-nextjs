import {
   Body,
   ConflictException,
   createHandler,
   ForbiddenException,
   Get,
   HttpCode,
   Param,
   Patch,
   Post,
   Req,
   UnauthorizedException,
   ValidationPipe
} from "next-api-decorators"
import { getToken, JWT } from "next-auth/jwt"
import { NextRequest } from "next/server"

import { CreateUserDto } from "@dto/createUser.dto"
import { UpdateUserDto } from "@dto/updateUser.dto"
import { prisma } from "@service/prisma"

import type { IUser } from "@interfaces/user.interface"

const bcrypt = require("bcrypt") // eslint-disable-line @typescript-eslint/no-var-requires

class UserHandler {
   
   @Get()
   @HttpCode(200)
   public async getAllUsers(): Promise<IUser[]> {
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

   @Post()
   @HttpCode(201)
   public async createUser(@Body(ValidationPipe) body: CreateUserDto): Promise<IUser> {
      const { name, email, password, imageUrl } = body

      const user = await prisma.user.findUnique({ where: { email: email } })
      if (user) throw new ConflictException("User with such email already exists")

      const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

      return await prisma.user.create({
         data: {
            email,
            password: passwordHash,
            name,
            imageUrl
         },
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
   }

   @Patch("/:id")
   @HttpCode(200)
   public async updatedUser(
      @Req() req: NextRequest,
      @Param("id") id: string,
      @Body(ValidationPipe) body: UpdateUserDto
   ): Promise<IUser> {
      const token = await this.getJwtToken(req)
      
      if (token && token.email) {
         const user = await prisma.user.findUnique({ where: { email: token.email } })
         if (!user) throw new UnauthorizedException()
         if (user.id !== id) throw new ForbiddenException()
         
         const { name, imageUrl } = body
         return prisma.user.update({
            where: { id: id },
            data: {
               name,
               imageUrl
            },
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

      } else {
         throw new UnauthorizedException()
      }
   }

   private async getJwtToken(req: NextRequest): Promise<JWT | null> {
      const secret = process.env.NEXTAUTH_SECRET
      return await getToken({
         req,
         secret
      })
   }
}

export default createHandler(UserHandler)