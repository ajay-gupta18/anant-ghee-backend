import { Type } from "@nestjs/class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, MaxLength, MinLength, minLength } from "class-validator";
import { AddressType } from "@prisma/client";

export class Address {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  phone: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  alternate_phone: string;

  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  pincode: string;

  @IsNotEmpty()
  @IsEnum(AddressType)
  type: AddressType;
}

export class CreateOrderDto {
  @IsObject()
  @Type(() => Address)
  @IsOptional()
  address?: Address;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  address_id?: number
}
