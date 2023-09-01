import {
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';
import { JwtPayloadInterface } from '../../auth/interface/jwt-payload.interface';

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext): JwtPayloadInterface => {
    const req = context.switchToHttp().getRequest();
    return req.user as JwtPayloadInterface;
  },
);

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
