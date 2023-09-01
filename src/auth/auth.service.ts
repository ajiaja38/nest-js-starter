import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/Login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Auth } from '../schema/authentications.schema';
import mongoose from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from './interface/login.response.interface';
import { jwtConstant } from './constant/constant';
import { RefreshTokenDto } from './dto/RefreshToken.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name)
    private readonly authModel: mongoose.Model<Auth>,

    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(payload: LoginDto): Promise<LoginResponse> {
    const user = await this.userService.validateUserCredentials(payload);
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  async generateAccessToken(user: any): Promise<string> {
    try {
      const payload = {
        guid: user.guid,
        username: user.username,
        role: user.role,
      };

      return await this.jwtService.signAsync(payload);
    } catch (error) {
      throw new error();
    }
  }

  async generateRefreshToken(user: any): Promise<string> {
    try {
      const payload = {
        guid: user.guid,
        username: user.username,
        role: user.role,
      };

      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: jwtConstant.refreshTokenSecret,
        expiresIn: '7d',
      });

      const refreshTokenExpiry = new Date();
      refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

      const schema = {
        guidUser: payload.guid,
        refreshToken,
        expiryDate: refreshTokenExpiry,
      };

      const createdAuth = new this.authModel(schema);
      createdAuth.save();

      return createdAuth.refreshToken;
    } catch (error) {
      throw new error();
    }
  }

  async veryfyRefreshToken(payload: RefreshTokenDto): Promise<string> {
    try {
      const { refreshToken } = payload;

      const token = await this.authModel.findOne({ refreshToken });

      if (!token) {
        throw new BadRequestException('refresh token tidak valid!');
      }

      const decode = this.jwtService.verify(refreshToken, {
        secret: jwtConstant.refreshTokenSecret,
      });

      if (!decode) {
        throw new UnauthorizedException('Session Habis, Silahkan Login Ulang.');
      }

      return await this.generateAccessToken(decode);
    } catch (error) {
      throw new BadRequestException('Refresh Token Tidak Valid');
    }
  }

  async logout(payload: RefreshTokenDto): Promise<void> {
    try {
      const { refreshToken } = payload;
      await this.authModel.findOneAndDelete({ refreshToken });
    } catch (error) {
      throw new BadRequestException('Refresh Token Tidak Valid!');
    }
  }
}
