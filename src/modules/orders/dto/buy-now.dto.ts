import { IsBoolean, IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class BuyNowDto {
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  addressId: number;

  @IsNotEmpty()
  @IsBoolean()
  isCOD: boolean;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;
}