import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"


export class CreateUserDto {
   @IsString()
   @IsNotEmpty()
   public readonly name!: string

   @IsEmail()
   @IsNotEmpty()
   public readonly email!: string

   @IsString()
   @MinLength(8)
   @IsNotEmpty()
   public readonly password!: string

   @IsString()
   @IsOptional()
   @IsNotEmpty()
   public readonly imageUrl?: string
}