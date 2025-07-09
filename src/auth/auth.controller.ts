import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { SignInDto, SignUpDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('signup')
  registerUser(@Body() userDto: SignUpDto, @Res() res: Response) {
    return this.authService.registerUser(userDto, res);
  }

  @Post('signin')
  loginUser(@Body() userDto: SignInDto, @Res() res: Response) {
    return this.authService.loginUser(userDto, res);
  }

  @Post('refresh') 
  refreshToken(@Req() req: Request, @Res() res: Response) {
    return this.authService.refreshToken(req, res);
  }

  
  @Post('forgot')
  forgotPassword(@Body() body: { email: string },@Res() res: Response) {
    return this.authService.forgotPassword(body, res);
  }

  @Post('reset') 
  resetPassword(@Body() body: { resetToken: string, password: string },@Res() res: Response) {
    return this.authService.resetPassword(body, res);
  }
}
