import { IsEmail, IsNotEmpty, Matches, Max, max, MaxLength, Min, MinLength } from "@nestjs/class-validator"

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail({message: "Email is required"})
  email: string

  @IsNotEmpty()
  @MaxLength(14)
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: "Password too weak"})
  password: string

  @IsNotEmpty()
  name: string
}   