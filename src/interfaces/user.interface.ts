import { Role } from "@prisma/client"

export interface IUser {
   id: string
   email: string
   name: string
   role: Role
   imageUrl: string | null
   createdAt: Date
   updatedAt: Date
}