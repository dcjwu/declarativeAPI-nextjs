import { IsNotEmpty, IsString, MinLength } from "class-validator"


export class ChangePasswordDto {
   @IsString()
   @IsNotEmpty()
   public readonly oldPassword!: string

   @IsString()
   @MinLength(8)
   @IsNotEmpty()
   public readonly newPassword!: string
}