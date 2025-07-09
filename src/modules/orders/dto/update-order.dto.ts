import { OrderStatus } from '@prisma/client';
import { IsEmpty, IsEnum } from '@nestjs/class-validator';
import { IsNotEmpty } from 'class-validator';

export class UpdateOrderDto  {
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus
}
