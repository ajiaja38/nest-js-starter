import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Put,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { JwtAuthGuard } from '../utils/guards/jwt-auth.guard';
import { Roles, User } from '../utils/decorators/custom.decorator';
import { JwtPayloadInterface } from 'src/auth/interface/jwt-payload.interface';
import { RoleGuard } from '../utils/guards/Roles.guard';
import { Role } from '../schema/users.schema';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async registerUserHandler(@Body() payload: CreateUserDto): Promise<object> {
    await this.userService.createUser(payload);
    return {
      status: HttpStatus.CREATED,
      message: 'Berhasil Registrasi Users',
    };
  }

  @Roles(Role.ADMIN)
  @Get()
  async getAllUsersHandler(): Promise<object> {
    const data = await this.userService.getAllUsers();

    return {
      status: HttpStatus.OK,
      message: 'Berhasil Get All Data User',
      data,
    };
  }

  @Roles(Role.ADMIN)
  @Get('/:guid')
  async getUserByGuidHandler(@Param('guid') guid: string): Promise<object> {
    const data = await this.userService.getUsersByGuidUsers(guid);

    return {
      status: HttpStatus.OK,
      message: `Berhasil Get Data User ${data.username}`,
      data,
    };
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get('/data/profile')
  async getUserProfileHandler(
    @User() user: JwtPayloadInterface,
  ): Promise<object> {
    const data = await this.userService.getUsersByGuidUsers(user.guid);

    return {
      status: HttpStatus.OK,
      message: `Berhasil Get Data User ${data.username}`,
      data,
    };
  }

  @Roles(Role.ADMIN)
  @Put('/:guid')
  async updateUserByGuidHandler(
    @Param('guid') guid: string,
    @Body() payload: UpdateUserDto,
  ): Promise<object> {
    await this.userService.updateUserByGuid(guid, payload);

    return {
      status: HttpStatus.OK,
      message: 'Berhasil update data user',
    };
  }

  @Roles(Role.ADMIN)
  @Delete('/:guid')
  async deleteUserByGuidHandler(@Param('guid') guid: string): Promise<object> {
    await this.userService.deleteUsersByGuid(guid);

    return {
      status: HttpStatus.OK,
      message: 'Berhasil Hapus users',
    };
  }
}
