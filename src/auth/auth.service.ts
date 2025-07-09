import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request, Response } from 'express';
import { CommonService } from 'src/common/common.service';
import { SignInDto, SignUpDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { MailQueueService } from 'src/queues/mail/mail.queue.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly commonService: CommonService,
    private readonly jwtService: JwtService,
    private readonly mailQueueService: MailQueueService
  ) {}

  async registerUser(userDto: SignUpDto, res: Response) {
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email: userDto.email
      }
    });

    if(existingUser) {
      throw new ForbiddenException("Email already exists");
    }

    // hash password
    const hashedPassword = await this.commonService.hashData(userDto.password);

    const newUser = await this.prismaService.user.create({
      data: {
      email: userDto.email,
      name: userDto.name,
      password_hash: hashedPassword
    }});

    await this.mailQueueService.sendRegisterationSuccessEmail(newUser.email, newUser.name);

    return res.status(201).json({message: "Registration successful"});
  }

  async loginUser(userDto: SignInDto, res: Response) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: userDto.email
      }
    });

    if(!user) {
      throw new UnauthorizedException("Wrong Credentials");
    }

    // compare password
    const passwordMatches = await this.commonService.compareHash(userDto.password, user.password_hash);

    if(!passwordMatches) {
      throw new UnauthorizedException("Wrong Credentials");
    }

    // generate jwt tokens
    const { access_token, refresh_token } = await this.commonService.generateTokens(user.id, user.email, user.role);
    const hashedRefreshToken = await this.commonService.hashData(refresh_token);

    // update refresh token in db
    await this.prismaService.user.update({
      where: {
        id: user.id
      },
      data:{
        refresh_hash: hashedRefreshToken
      }
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true, 
      sameSite: true, 
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    });

    // TODO: Notify user for new login via email

    return res.status(200).json({
      data: { id: user.id, email: user.email, name:user.name, access_token },
      message: "User logged in successfully",
      status: "Success"
    });
  }

  async refreshToken(req: Request, res: Response) {
    const token = req.cookies?.refresh_token || null;

    if(!token) {
      throw new UnauthorizedException();
    }

    try{
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET
      });

      const access_token = await this.jwtService.sign({
        id: payload.id, 
        email: payload.email, 
        role: payload.role
      }, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: 60 * 15 // 15 min
      });

      return res.status(200).json({
        message: "access token created successfully",
        data: {
          access_token
        }
      });
    } catch(error) {
      console.log("Error while validating refresh token", error);
      throw new ForbiddenException();
    }
  }

  async forgotPassword(body: { email: string },res: Response) {
    const { email } = body;
    if(!email) {
      throw new BadRequestException("Email not provided");
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        email
      }
    });

    if(!user) {
      throw new NotFoundException("Email not found");
    }

    const reset_password_token = await this.jwtService.signAsync({ email: user.email }, {
      secret: process.env.JWT_RESET_PASSWORD_SECRET_KEY,
      expiresIn: 60 * 10 // 10 min expiration time
    });
    const FE_PASSWORD_RESET_URL = process.env.ENVIRONMENT === 'development' ? process.env.DEV_PASSWORD_RESET_FRONTEND_URL:process.env.PASSWORD_RESET_FRONTEND_URL;
    const resetURL = `${FE_PASSWORD_RESET_URL}=${reset_password_token}`;

    const updatedUser = await this.prismaService.user.update({
      where: {
        id: user.id
      },
      data: {
        reset_password_token
      }
    });

    await this.mailQueueService.sendResetPasswordEmail(updatedUser.email, updatedUser.name, resetURL);

    return res.status(200).json({
      message: "Password reset link has been sent",
      data: {}
    });

  }

  async resetPassword(body: { resetToken?: string, password: string }, res: Response) {
    const { resetToken, password } = body;
    if(!resetToken) {
      throw new BadRequestException("Token not provided");
    }

    try{  
      await this.jwtService.verifyAsync(resetToken, {
        secret: process.env.JWT_RESET_PASSWORD_SECRET_KEY
      });
    }catch(error) {
      console.log("Reset token expired or invalid", error);
      throw new BadRequestException("Invalid reset token");
    }


    const user = await this.prismaService.user.findUnique({
      where: {
        reset_password_token: resetToken
      }
    });

    if(!user) {
      throw new UnauthorizedException("Token is expired or invalid");
    }

    const password_hash = await this.commonService.hashData(password);

    const updatedUser = await this.prismaService.user.update({
      where: {
        id: user.id
      },
      data: {
        password_hash,
        reset_password_token: null,
        reset_password_expiration: null
      }
    });

    await this.mailQueueService.sendPasswordResetSuccessEmail(updatedUser.email, updatedUser.name);

    return res.status(200).json({
      message: "Password reseted",
      data: {
        
      }
    });
  }

}
