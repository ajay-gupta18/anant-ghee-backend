import { Injectable, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class UsersService {

  constructor(private readonly prismaService: PrismaService) {}

  async addAddress(addressDto: CreateAddressDto, req: Request, res: Response) {
    const {id: user_id} = req['currentUser'];
    const newAddress = await this.prismaService.address.create({
      data: {
        name: addressDto.name,
        user_id,
        phone: addressDto.phone,
        alternate_phone: addressDto.alternate_phone || null,
        street: addressDto.street,
        city: addressDto.city,
        state: addressDto.state,
        pincode: addressDto.pincode,
        type: addressDto.type,
      }
    });

    return res.status(201).json({
      message: "Address added",
      address: newAddress
    })
}

  async updateAddress(id: number, addressDto: UpdateAddressDto, res: Response) {
    const address = await this.prismaService.address.findUnique({
      where: {
        id
      }
    });

    if(!address) {
      throw new NotFoundException("Address not found");
    }

    const updatedAddress = await this.prismaService.address.update({
      where: {
        id
      },
      data: {
        name: addressDto.name || address.name,
        phone: addressDto.phone || address.phone,
        alternate_phone: addressDto.alternate_phone || address.alternate_phone,
        street: addressDto.street || address.street,
        city: addressDto.city || address.city,
        state: addressDto.state || address.state,
        pincode: addressDto.pincode || address.pincode,
        type: addressDto.type || address.type,
      }
    });

    return res.status(200).json({
      message: "Address updated",
      data: updatedAddress
    });
  }

  async removeAddress(id: number, res: Response) {
    const address = await this.prismaService.address.findUnique({
      where: {
        id
      }
    });

    if(!address) {
      throw new NotFoundException("Address not found");
    }
    
    const deletedAddress = await this.prismaService.address.delete({
      where: {
        id
      }
    });

    return res.status(200).json({
      message: "Addres removed",
      data: deletedAddress
    });
  }

  async getAllAddresses(req: Request, res: Response) {
    const { id: user_id } = req['currentUser'];

    const addresses = await this.prismaService.address.findMany({
      where: {
        user_id
      }
    });

    return res.status(200).json({
      message: "Addresses fetched",
      data: addresses
    })
  }
}
