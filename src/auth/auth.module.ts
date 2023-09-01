import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from '../schema/authentications.schema';
import { JwtModule } from '@nestjs/jwt';
import { accessTokenConfig } from '../utils/config/jwt.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenCleanUpService } from './cleanToken.service';

@Module({
  imports: [
    UserModule,
    JwtModule.register(accessTokenConfig),
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshTokenCleanUpService],
})
export class AuthModule {}
