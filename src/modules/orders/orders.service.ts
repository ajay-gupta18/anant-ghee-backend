import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Address, CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request, Response } from 'express';
import { OrderStatus, PaymentMode, PaymentStatus } from 'generated/prisma';
import { BuyNowDto } from './dto/buy-now.dto';
import { RazorpayService } from 'src/payment/razorpay/razorpay.service';

@Injectable()
export class OrdersService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly razorpayService: RazorpayService
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    req: Request, res: Response,  
    action?: string, 
    variantId?: string, 
    quantity?: number
  ) {
    const {id: user_id} = req["currentUser"];
    if(!action || (action !== 'buy-now' && action !== 'cart')) {
      throw new BadRequestException("Valid action not provided")
    }

    if(!createOrderDto?.address && !createOrderDto?.address_id) {
      throw new BadRequestException("Address or address_id not found");
    }

    if(action === 'buy-now' && variantId) {
      
      const variant = await this.prismaService.variant.findUnique({
        where: {
          id: +variantId
        },
        include: {
          product: true
        }
      });
      
      if(!variant) {
        throw new NotFoundException("Product not found");
      }

      const totalPrice = variant.price * (quantity || 1);
      const totalActualPrice = variant.actual_price * (quantity || 1);
      const discount = Math.round(((totalActualPrice - totalPrice) / totalPrice) * 100);

      if(quantity && quantity > variant.stock) {
        throw new ConflictException("Requested quantity exceeds available stock");
      }
      
      let address_id;
      
      if(createOrderDto.address_id) {
        address_id = createOrderDto.address_id;
      } else if(createOrderDto.address){
        address_id = await this.createAddress(createOrderDto.address, user_id);
      }
      
      
      const newOrder = await this.prismaService.order.create({
        data: {
          address_id,
          user_id,
          order_items: {
            create: {
              variant_id: variant.id,
              ordered_actual_price: totalActualPrice,
              ordered_price: totalPrice,
              quantity: quantity || 1,
              discount
            }
          }
        }
      });

      return res.status(201).json({message: "Order placed", data: newOrder});
    } 
    else if(action === 'cart') {
      let address_id;

      if(createOrderDto.address_id) {
        address_id = createOrderDto.address_id;
      } else if(createOrderDto.address){
        address_id = await this.createAddress(createOrderDto.address, user_id);
      }

      const carts = await this.prismaService.cart.findMany({
        where: {
          user_id
        }
      });

      if(!carts.length) {
        throw new NotFoundException("No item found in cart");
      }

      const orders: any[] = [];

      await Promise.all(
        carts.map(async (cart) => {
          const variant = await this.prismaService.variant.findUnique({
            where: {
              id: cart.variant_id
            },
            include: {
              product: true
            }
          });

          if(!variant) {
            throw new NotFoundException("Product not found");
          }

          const discount =  Math.round(((variant.actual_price - variant.price) / variant.price) * 100);
          const newOrder = await this.prismaService.order.create({
            data: {
              address_id,
              user_id,
              order_items: {
                create: {
                  variant_id: variant.id,
                  ordered_actual_price: variant.actual_price,
                  ordered_price: variant.price,
                  quantity: quantity || 1,
                  discount
                }
              }
            }
          });

          orders.push(newOrder);
        })
      );

      await this.prismaService.cart.deleteMany({
        where: {
          user_id
        }
      });

      return res.status(201).json({message: "Order placed", data: orders});

    }
    else {
      throw new BadRequestException("Invalid query params");
    }

  }

  async buyNowProduct(id: number, buyNowDto: BuyNowDto, req: Request, res: Response) {
    const {id: user_id} = req["currentUser"];
    const { addressId: address_id, isCOD, quantity } = buyNowDto;

    const variant = await this.prismaService.variant.findUnique({
      where: {
        id
      },
      include: {
        product: true
      }
    });
    
    if(!variant) {
      throw new NotFoundException("Product not found");
    }

    const totalPrice = variant.price * (quantity || 1);
    const totalActualPrice = variant.actual_price * (quantity || 1);
    const discount = Math.round(((totalActualPrice - totalPrice) / totalPrice) * 100);

    if(quantity > variant.stock) {
      console.log(`quantit- ${quantity} , stock-, ${variant.stock}`)
      throw new ConflictException("Requested quantity exceeds available stock");
    }

    const newOrder = await this.prismaService.order.create({
      data: {
        address_id,
        user_id,
        total_actual_price: totalActualPrice,
        total_price: totalPrice,
        order_items: {
          create: {
            variant_id: variant.id,
            ordered_actual_price: totalActualPrice,
            ordered_price: totalPrice,
            quantity,
            discount
          }
        },
        order_tracking: {
          create: {
            // TODO: add tracking details
          }
        }
      },
      include: {
        order_items: true,
        order_tracking: true
      }
    });

    const updatesVariant = await this.prismaService.variant.update({
      where: {
        id
      },
      data: {
        stock: variant.stock - quantity
      }
    });

    if(isCOD) {
      const payment_mode = PaymentMode.COD;
      const payment_status = PaymentStatus.PENDING;

      const updatedOrder = await this.prismaService.order.update({
        where: {id: newOrder.id},
        data: {
          payment_mode,
          payment_status
        }
      });
      return res.status(201).json({
        message: "Order placed",
        data: newOrder,
        isCOD: true
      });
    } else {
      // TODO: change order ammount - newOrder.total_price
      const paymentOrder = await this.razorpayService.createOrder(1);
      
      const paymentDetails = await this.prismaService.paymentDetails.create({
        data:{
          amount: paymentOrder.amount,
          amount_due: paymentOrder.amount_due,
          amount_paid: paymentOrder.amount_paid,
          attempts: paymentOrder.attempts,
          currency: paymentOrder.currency,
          entity: paymentOrder.entity,
          receipt: paymentOrder.receipt,
          payment_order_id: paymentOrder.id,
          status: paymentOrder.status,
          order: {
            connect: {id: newOrder.id}
          }
        }
      })
      return res.status(201).json({
        message: "Order placed",
        data: newOrder,
        paymentDetails,
        isCOD: false
      });
    }

  }

  private async createAddress(address: Address, user_id: number) {
    const newAddress = await this.prismaService.address.create({
      data: {
        name: address.name,
        user_id,
        phone: address.phone,
        alternate_phone: address.alternate_phone || null,
        street: address.street,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        type: address.type,
      }
    });

    return newAddress.id;
  }

  async findAll(req: Request, res: Response) {
    const {id: user_id} = req['currentUser'];

    const orders = await this.prismaService.order.findMany({
      where: {
        user_id
      },
      select: {
        id: true,
        status: true,
        order_items: {
          include: {
            variant: {
              select: {
                id: true,
                size: true,
                unit: true,
                price: true,
                actual_price: true,
                stock: true,
                product: {
                  select: {
                    name: true,
                    image_url: true
                  }
                }
              }
            }
          }
        },
        order_tracking: true
      },
    });

    const formattedOrders = orders.map((order) => {
      const formattedOrderItem = order.order_items.map((orderItem) => {
        const {variant: {id, ...restVariants}, ...rest} = orderItem;
        return {
          ...rest,
          ...restVariants
        }
      });

      return {
        ...order,
        order_items: formattedOrderItem
      }
    })

    return res.status(200).json({message: "Fetched orders", data: formattedOrders});
  }

  async findOne(id: number, res: Response) {
    const order = await this.prismaService.order.findUnique({
      where:{
        id
      },
      select: {
        id: true,
        status: true, 
        order_items: {
          include: {
            variant: true
          }
        },
        order_tracking: true,
        address: true
      },
    });

    if(!order) {
      throw new NotFoundException("Order not found");
    }

    return res.status(200).json({
      message: "Order fetched",
      data: order
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto, res: Response) {
    const order = await this.prismaService.order.findUnique({
      where: {
        id
      }
    });

    if(!order) {
      throw new NotFoundException("Order not found");
    }

    const updatedOrder = await this.prismaService.order.update({
      where: {
        id
      },
      data: {
        status: updateOrderDto.status
      }
    });

    res.status(200).json({
      message:"Order updated",
      data: updatedOrder
    })
  }

  async cancelOrder(res: Response, id: number) {
    const order = await this.prismaService.order.findUnique({
      where: {
        id
      }
    });

    if(!order) {
      throw new NotFoundException("Order not found");
    }

    if(order.status === OrderStatus.DELIVERED) {
      throw new NotFoundException("Can not cancelled Delivered order");
    } 

    const updatedOrder = await this.prismaService.order.update({
      where: {
        id
      },
      data: {
        status: OrderStatus.CANCELLED
      }
    });

    return res.status(200).json({
      message: "Order cancelled",
      data: updatedOrder
    })
  }

  async verifyPayment(orderId: string, paymentId: string, signature: string, res) {
    const isValid = this.razorpayService.validateSignature(orderId, paymentId, signature);

    if (!isValid) {

      throw new BadRequestException("Payment is not valid");
    }
    
    return res.status().json({ success: true, message: 'Payment verified successfully' });
  }
}
