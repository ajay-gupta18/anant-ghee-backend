import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bycrypt from "bcryptjs"
import { Roles } from 'generated/prisma';

@Injectable()
export class CommonService {
  constructor(
    private readonly jwtService: JwtService
  ) {}

  async hashData(data: string) {
    return await bycrypt.hashSync(data);
  }

  async compareHash(data: string, hash: string) {
    return await bycrypt.compareSync(data, hash);
  }

  async generateTokens(id: number, email: string, role: Roles) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          id,
          email,
          role
        },
        {
          secret: process.env.JWT_ACCESS_TOKEN_SECRET,
          expiresIn: 60 * 15 // 15 min
        }
      ),
      this.jwtService.signAsync(
        {
          id,
          email,
          role
        },
        {
          secret: process.env.JWT_REFRESH_TOKEN_SECRET,
          expiresIn: 60 * 60 * 24 * 7
        }
      )
    ]);

    return {
      access_token,
      refresh_token
    }
  }
}
