import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { JwtPayloadInterface } from '../../auth/interface/jwt-payload.interface';
import { Role } from '../../schema/users.schema';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: JwtPayloadInterface = request.user;

    return this.matchRoles(roles, user.role);
  }

  private matchRoles(allowedRoles: string[], userRole: Role) {
    return allowedRoles.some((role) => role === userRole);
  }
}
