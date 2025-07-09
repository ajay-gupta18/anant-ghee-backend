import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateCartDto {
  @IsNotEmpty()
  @IsNumber()
  variant_id: number;
}
