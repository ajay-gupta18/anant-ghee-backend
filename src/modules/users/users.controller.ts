import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { AuthenticationGuard } from 'src/guard';
import { Role } from 'src/decorator/roles.decorator';
import { Roles } from 'generated/prisma';
import { AuthorizationGuard } from 'src/guard/Authorization.guard';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CreateAddressDto } from './dto/create-address.dto';

@Role(Roles.USER)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Post('/address')
  addAddress(@Body() addressDto: CreateAddressDto, @Req() req: Request, @Res() res: Response) {
    return this.usersService.addAddress(addressDto, req, res);
  }

  @Get()
  findAll(@Req() req: Request)  {
    return req['currentUser'];
  }

  @Get('address')
  getAllAddresses(@Req() req: Request, @Res() res: Response) {
    return this.usersService.getAllAddresses(req, res);
  }

  @Patch('address/:id')
  updateAddress(@Param('id') id: string, @Body() addressDto: UpdateAddressDto, @Res() res: Response) {
    return this.usersService.updateAddress(+id, addressDto, res);
  }

  @Delete('address/:id')
  removeAddress(@Param('id') id: string, @Res() res: Response) {
    return this.usersService.removeAddress(+id, res);
  }
}
