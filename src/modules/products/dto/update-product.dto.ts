import { PartialType } from '@nestjs/swagger';
import { CreateProductDto, VariantDto } from './create-product.dto';
import { IsArray, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ProductTag } from 'generated/prisma';
import { Type } from 'class-transformer';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsEnum(ProductTag)
  @IsOptional()
  tag?: ProductTag;

  @IsArray()
  @Type(() => PartialType(VariantDto))
  variants: VariantDto[];
}
