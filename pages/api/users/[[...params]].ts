import { PrismaClientKnownRequestError } from "@prisma/client/runtime"
import {
   Body,
   createHandler,
   ForbiddenException,
   Get,
   HttpCode,
   NotFoundException,
   Patch,
   Post,
   SetHeader,
   UnprocessableEntityException,
   ValidationPipe
} from "next-api-decorators"

import { CurrentUser } from "@decorators/currentUser.decorator"
import { ChangePasswordDto } from "@dto/changePassword.dto"
import { CreateUserDto } from "@dto/createUser.dto"
import { UpdateUserDto } from "@dto/updateUser.dto"
import { AdminGuard } from "@guards/admin.guard"
import { prisma } from "@service/prisma"

import type { IUser } from "@interfaces/user.interface"

const bcrypt = require("bcrypt") // eslint-disable-line @typescript-eslint/no-var-requires

// @UseMiddleware(AuthMiddleware)
@SetHeader("Access-Control-Allow-Origin", "https://www.example.com")
@SetHeader("Access-Control-Allow-Methods", "POST, GET")
class UserHandler {
   
   @Get()
   @HttpCode(200)
   // @AdminGuard()
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

   @Patch()
   @HttpCode(200)
   public async updatedUser(
      @Body(ValidationPipe) body: UpdateUserDto,
      @CurrentUser() currentUser: IUser | null
   ): Promise<IUser> {
      if (currentUser) {
         const { name, imageUrl } = body
         return prisma.user.update({
            where: { id: currentUser.id },
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

      } throw new NotFoundException("User not found")
   }

   @Get("/me")
   @HttpCode(200)
   public async getMe(
      @CurrentUser() currentUser: IUser | null
   ): Promise<IUser> {
      if (currentUser) return currentUser
      
      throw new NotFoundException("User not found")
   }

   @Patch("/change-password")
   @HttpCode(200)
   public async changePassword(
      @Body(ValidationPipe) body: ChangePasswordDto,
      @CurrentUser() currentUser: IUser | null
   ): Promise<IUser> {
      if (currentUser) {
         const { oldPassword, newPassword } = body
         const userProfile = await prisma.user.findUnique({ where: { id: currentUser.id } })
         if (!userProfile) throw new NotFoundException("User not found")

         const isPasswordCorrect = await bcrypt.compareSync(oldPassword, userProfile.password)
         if (!isPasswordCorrect) throw new UnprocessableEntityException("Incorrect password")

         const newPasswordHash = await bcrypt.hashSync(newPassword, 10)
         return await prisma.user.update({
            where: { id: currentUser.id },
            data: { password: newPasswordHash },
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
      
      throw new NotFoundException("User not found")
   }
}

export default createHandler(UserHandler)