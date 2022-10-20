import { PrismaClientKnownRequestError } from "@prisma/client/runtime"
import {
   Body,
   createHandler,
   ForbiddenException,
   Get,
   HttpCode,
   NotFoundException,
   Param,
   Patch,
   Post, UseMiddleware,
   ValidationPipe
} from "next-api-decorators"

import { CurrentUser } from "@decorators/currentUser.decorator"
import { CreateUserDto } from "@dto/createUser.dto"
import { UpdateUserDto } from "@dto/updateUser.dto"
import { AdminGuard } from "@guards/admin.guard"
import { AuthMiddleware } from "@middleware/auth.middleware"
import { prisma } from "@service/prisma"

import type { IUser } from "@interfaces/user.interface"
import type { User } from "@prisma/client"

const bcrypt = require("bcrypt") // eslint-disable-line @typescript-eslint/no-var-requires

@UseMiddleware(AuthMiddleware)
class UserHandler {
   
   @Get()
   @HttpCode(200)
   @AdminGuard()
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
   @AdminGuard()
   public async createUser(@Body(ValidationPipe) body: CreateUserDto): Promise<IUser> {
      const { name, email, password, imageUrl } = body

      try {
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

      } catch (err) {
         if (err instanceof PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
               throw new ForbiddenException(`User with email ${email} already exists`)
            }
         } throw err
      }
   }

   @Patch("/:id")
   @HttpCode(200)
   public async updatedUser(
      @Param("id") id: string,
      @Body(ValidationPipe) body: UpdateUserDto,
      @CurrentUser() currentUser: User | null
   ): Promise<IUser> {
      if (currentUser) {
         if (currentUser.id !== id) throw new ForbiddenException()

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

      } else throw new NotFoundException("User not found")
   }

   @Get("/me")
   @HttpCode(200)
   public async getMe(
      @CurrentUser() currentUser: IUser | null
   ): Promise<IUser> {
      if (currentUser) return currentUser
      throw new NotFoundException("User not found")
   }
}

export default createHandler(UserHandler)