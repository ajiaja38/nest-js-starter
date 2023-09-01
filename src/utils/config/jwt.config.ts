import { JwtModuleOptions } from '@nestjs/jwt';
import { jwtConstant } from '../../auth/constant/constant';

export const accessTokenConfig: JwtModuleOptions = {
  global: true,
  secret: jwtConstant.accessTokenSecret,
  signOptions: {
    expiresIn: '15m',
  },
};
