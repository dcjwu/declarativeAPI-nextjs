import { IsOptional, IsString } from "class-validator"


export class UpdateUserDto {
   @IsString()
   @IsOptional()
   public readonly name?: string

   @IsString()
   @IsOptional()
   public readonly imageUrl?: string
}