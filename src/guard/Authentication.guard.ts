import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromHeaders(req);

    if(!accessToken) {
     throw new UnauthorizedException();
    }
    
    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET
      });
  
      req['currentUser'] = payload;
      return true;
    } catch(error) {
      console.log("error while verifying access token", error);
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeaders(req: Request) {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === "Bearer" ? token : undefined;
  }
}