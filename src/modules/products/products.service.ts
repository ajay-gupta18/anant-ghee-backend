import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto, VariantDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Response } from 'express';

@Injectable()
export class ProductsService {

  constructor(private readonly prismaService: PrismaService) {}

  async create(createProductDto: CreateProductDto, res: Response) {
    let {variants, name, tag} = createProductDto;

    const variantWithDiscount = variants.map((variant) => {
      variant['discount'] = Math.round(((variant.actual_price - variant.price) / variant.actual_price) * 100);
      return variant;
    });

    await this.prismaService.product.create({
      data: {
        name: name,
        tag,
        variants: {
          create: variantWithDiscount
        }
      }
    });

    return res.status(201).json({message: "product created"});
  }

  async findAll(res: Response) {
    const products = await this.prismaService.product.findMany({
      include: {
        variants: {
          where: {
            deleted: false
          },
          omit: {
            productId: true
          }
        }
      }
    });

    return res.status(200).json({message: "Fetched products", data: products});
  }

  async findOne(id: number, res: Response) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id,
      },
      include: {
        variants: {
          where: {
            deleted: false
          }
        }
      }
    });

    if(!product) {
      throw new NotFoundException("Product not found");
    }

    return res.status(200).json({message: "Fetched product", data: product});
  }

  async findVariant(id: number,variantId: number, res: Response) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id,
      },
      include: {
        variants: {
          where: {
            deleted: false,
            id: variantId
          }
        }
      }
    });

    if(!product) {
      throw new NotFoundException("Variant not found");
    }
    const {variants, ...rest} = product;
    const formatedProduct = {...rest, variant: variants[0]}

    return res.status(200).json({message: "Fetched product", data: formatedProduct});
  }

  async update(id: number, updateProductDto: UpdateProductDto, res: Response) {

    if(!updateProductDto) {
      throw new BadRequestException("No data supplied to update");
    }
    const product = await this.prismaService.product.findUnique({
      where: {
        id
      }
    });

    if(!product) {
      throw new NotFoundException("Product not found");
    }
    let tag;
    switch(updateProductDto.tag){
      case undefined:
        return tag = product.tag;
      case null:
        return tag = null;
      default:
        tag = updateProductDto.tag;
    }

    const updatedProduct = await this.prismaService.product.update({
      where: { id },
      data: {
        name: updateProductDto.name ?? product.name,
        tag,
        variants: {
          update: updateProductDto.variants?.map(variant => ({
            where: { id: variant.id },
            data: {
              size: variant.size,
              unit: variant.unit,
              actual_price: variant.actual_price,
              price: variant.price,
              stock: variant.stock,
              discount: variant.discount,
            },
          })) || [],
        },
      },
      include: {
        variants: true,
      },
    });
    
    return res.status(200).json({
      message: "Product details updated",
      data: updatedProduct
    })
  }

  // soft delete
  async removeVariant(id: number, res: Response) {
    const variant = await this.prismaService.variant.findUnique({
      where: {
        id
      }
    });

    if(!variant || variant.deleted) {
      throw new NotFoundException("Product variant not found");
    }

    const deletedVariant = await this.prismaService.variant.update({
      where: {
        id
      },
      data: {
        deleted: true
      }
    });

    return res.status(200).json({
      message: "Product variant deleted",
      data: deletedVariant
    });
  }
}
