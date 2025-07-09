import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "@prisma/client";
import { Observable } from "rxjs";
import { ROLE_KEY } from "src/decorator/roles.decorator";

@Injectable()
export class AuthorizationGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const role = this.reflector.getAllAndOverride<Roles>(ROLE_KEY, [context.getHandler(), context.getClass()]);

    const payload = req['currentUser'];
    if(!role || !payload) {
      return false;
    }

    if(role === payload.role || role === Roles.ADMIN) {
      return true;
    }

    return false;
  }
}