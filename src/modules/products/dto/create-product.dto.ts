import { IsEnum, IsNotEmpty, IsNumber, IsOptional, ValidateNested, IsArray, IsNotIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductTag } from '@prisma/client';
import { isNotIn, IsPositive } from '@nestjs/class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsEnum(ProductTag)
  @IsOptional()
  tag?: ProductTag;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  variants: VariantDto[];
}

export class VariantDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNumber()
  size: number;

  @IsNotEmpty()
  unit: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  stock: number;

  @IsOptional()
  discount: number;
  
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  actual_price: number;
}