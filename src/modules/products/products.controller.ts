import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto, @Res() res: Response) {
    return this.productsService.create(createProductDto, res);
  }

  @Get()
  findAll(@Res() res: Response) {
    return this.productsService.findAll(res);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    return this.productsService.findOne(+id, res);
  }

  @Get(':id/variant/:variantid')
  findVariant(@Param('id') id: string,@Param('variantid') variantId: string, @Res() res: Response) {
    return this.productsService.findVariant(+id,+variantId, res);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Res() res: Response) {
    return this.productsService.update(+id, updateProductDto, res);
  }

  @Delete(':id')
  removeVariant(@Param('id') id: string, @Res() res: Response) {
    return this.productsService.removeVariant(+id, res);
  }
}
