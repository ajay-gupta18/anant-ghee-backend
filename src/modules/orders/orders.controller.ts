import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, Res, UseGuards, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Request, Response } from 'express';
import { AuthenticationGuard } from 'src/guard';
import { BuyNowDto } from './dto/buy-now.dto';

@UseGuards(AuthenticationGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto, 
    @Req() req: Request,
    @Res() res: Response,
    @Query('action') action?: string, 
    @Query('id') variantId?: string,
    @Query('quantity') quantity?: number,
  ) {
    return this.ordersService.create(createOrderDto, req, res, action, variantId, quantity);
  }

  @Post('buy-now/:id')
  buyNowProduct(@Body() buyNowDto: BuyNowDto, @Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    return this.ordersService.buyNowProduct(+id, buyNowDto, req, res);
  }

  @Get()
  findAll( @Req() req: Request, @Res() res: Response) {
    return this.ordersService.findAll(req, res);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    return this.ordersService.findOne(+id, res);
  }

  //TODO: add admin access only
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto, @Res() res: Response) {
    return this.ordersService.update(+id, updateOrderDto, res);
  }

  @Delete('/:id/cancel')
  cancelOrder(@Res() res: Response, @Param('id') id: string) {
    return this.ordersService.cancelOrder(res, +id);
  }

  @Post('verify')
  verifyPayment(
    @Body('orderId') orderId: string,
    @Body('razorpayPaymentId') paymentId: string,
    @Body('razorpaySignature') signature: string,
    @Res() res: Response
  ) {
    return this.ordersService.verifyPayment(orderId, paymentId, signature, res);
  }
}
