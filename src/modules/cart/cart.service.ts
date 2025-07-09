import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request, Response } from 'express';

@Injectable()
export class CartService {

  constructor(private readonly prismaService: PrismaService) {}

  async create(createCartDto: CreateCartDto, req: Request, res: Response) {
    const {id: user_id} = req['currentUser'];
    const {variant_id} = createCartDto;

    const variant = await this.prismaService.variant.findUnique({
      where: {
        id: variant_id
      }
    });

    if(!variant) {
      throw new BadRequestException(`Varinat with ${variant_id} not exists`)
    }

    const cart = await this.prismaService.cart.findUnique({
      where: {
        user_id_variant_id:{
          variant_id,
          user_id
      }
      }
    });

    if((!cart?.quantity && variant.stock < 1 ) || (cart?.quantity &&cart?.quantity + 1 > variant.stock) ) {
      throw new ConflictException("Requested quantity exceeds available stock");
    }

    const updatedCart = await this.prismaService.cart.upsert({
      where: {
        user_id_variant_id: {
          user_id,
          variant_id
        }
      },
      update: {
        quantity: {increment : 1}
      },
      create:{
        user_id,
        variant_id,
        quantity: 1
      }
    })
    return res.status(201).json({message: "Item added to cart", data:{id: updatedCart.id, quantity: updatedCart.quantity}});
  }

  async findAll(req: Request , res: Response, variantId?: string) {
    const {id: user_id} = req['currentUser'];

    if(variantId) {
      const variant = await this.prismaService.variant.findUnique({
        where: {
          id: +variantId
        },
        include:{
          product: {
            select: {
              id: true,
              name: true,
              tag: true
            }
          }
        },
        omit: {
          created_at: true,
          updated_at: true,
          productId: true
        }
      });

      if(!variant) {
        throw new NotFoundException("Product not found")
      }

      const { product, ...restVariant } = variant;
      const formattedVariant = {
        id: 0,
        variant: {...restVariant}, 
        product
      }

      return res.status(200).json({
        message: "Fetched product",
        data: formattedVariant
      });
    }

    const carts = await this.prismaService.cart.findMany({
      where: {
        user_id
      },
      select: {
        id: true,
        quantity: true,
        variant: {
          omit: {
            created_at: true,
            updated_at: true,
            productId: true
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                tag: true
              }
            }
          }
        }
      },
    });

    const formattedCartItems = carts.map((cart) => {
      const {product, ...rest} = cart.variant;
      const newCartItem = {
        ...cart,
        variant: rest,
        product
      }
      return newCartItem
    })

    return res.status(200).json({message: "Fetched cart item", data: formattedCartItems});
  }

  async decreaseQuantity(cartItemId: number, req: Request, res: Response) {
    const {id: user_id} = req['currentUser'];

    const cartItem = await this.prismaService.cart.findUnique({
      where: {
        id: cartItemId
      }
    });

    if(!cartItem) {
      throw new NotFoundException("Cart item not found");
    }
    
    let updatedCartItem;
    if(cartItem.quantity > 1) {
      updatedCartItem = await this.prismaService.cart.update({
        where: {
          id: cartItemId
        },
        data: {
          quantity: {
            decrement: 1
          }
        }
      });
    } else {
      updatedCartItem = await this.prismaService.cart.delete({
        where: {
          id: cartItemId
        }
      });
      updatedCartItem.deleted = true
    }

    return res.status(200).json({message: "Decreased cart item quantity", data: {id: updatedCartItem.id, quantity: updatedCartItem.quantity, deleted: updatedCartItem?.deleted}});
  }

  async remove(id: number, req, res) {
    const cartItem = await this.prismaService.cart.findUnique({
      where: {
        id
      }
    });

    if(!cartItem) {
      throw new NotFoundException("Cart item not found");
    }

    await this.prismaService.cart.delete({
      where: {
        id
      }
    });

    return res.status(200).json({message: "Cart item deleted", data: {id: cartItem.id}});
  }
}
