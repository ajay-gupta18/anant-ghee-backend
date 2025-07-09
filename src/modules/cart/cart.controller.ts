import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, Req, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Request, Response } from 'express';
import { AuthenticationGuard } from 'src/guard';

@UseGuards(AuthenticationGuard)
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto, @Req() req: Request, @Res() res: Response) {
    return this.cartService.create(createCartDto, req , res);
  }

  @Get()
  findAll(@Req() req: Request, @Res() res: Response, @Query('id') variantId?: string) {
    return this.cartService.findAll(req , res, variantId);
  }

  @Patch(':id')
  decreaseQuantity(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    return this.cartService.decreaseQuantity(+id, req, res);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    return this.cartService.remove(+id, req, res);
  }
}
