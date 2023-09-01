import {
  Controller,
  Body,
  Post,
  Put,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/Login.dto';
import { RefreshTokenDto } from './dto/RefreshToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async loginHandler(@Body() payload: LoginDto): Promise<object> {
    const data = await this.authService.login(payload);
    return {
      status: HttpStatus.CREATED,
      data,
    };
  }

  @Put('/refreshtoken')
  async refreshTokenHandler(@Body() payload: RefreshTokenDto): Promise<object> {
    const accessToken = await this.authService.veryfyRefreshToken(payload);

    return {
      status: HttpStatus.OK,
      data: {
        accessToken,
      },
    };
  }

  @Delete('/logout')
  async logoutHandler(@Body() payload: RefreshTokenDto): Promise<object> {
    await this.authService.logout(payload);

    return {
      status: HttpStatus.OK,
      message: 'Berhasil Logout',
    };
  }
}
