import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstant } from '../constant/constant';
import { JwtPayloadInterface } from '../interface/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstant.accessTokenSecret,
    });
  }

  async validate(payload: JwtPayloadInterface): Promise<object> {
    if (!payload) {
      throw new UnauthorizedException('Access Denied');
    }

    return payload;
  }
}
