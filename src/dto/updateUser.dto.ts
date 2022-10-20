import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class UpdateUserDto {
   @IsString()
   @IsOptional()
   @IsNotEmpty()
   public readonly name?: string

   @IsString()
   @IsOptional()
   @IsNotEmpty()
   public readonly imageUrl?: string
}