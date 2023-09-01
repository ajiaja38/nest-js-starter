import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Role, User } from '../schema/users.schema';
import { CreateUserDto } from './dto/createUser.dto';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/updateUser.dto';
import { LoginDto } from '../auth/dto/Login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<User>,
  ) {}

  async createUser(payload: CreateUserDto): Promise<any | string> {
    const {
      username,
      email,
      password,
      confirmPassword,
      role = Role.USER,
    } = payload;

    await this.validateDuplicatedData(email);

    if (confirmPassword !== password) {
      throw new BadRequestException(
        'Password dan Confirm Password tidak cocok!',
      );
    }

    let rolePrevix: string;

    role === Role.ADMIN ? (rolePrevix = Role.ADMIN) : (rolePrevix = Role.USER);

    const guid = `${rolePrevix}-${uuidv4()}`;
    const hasedPassword = await bcrypt.hash(password, 12);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const schema = {
      guid,
      username,
      email,
      password: hasedPassword,
      role,
      createdAt,
      updatedAt,
    };

    const createdUser = new this.userModel(schema);
    await createdUser.save();
  }

  async getAllUsers(): Promise<User[] | any> {
    try {
      const users = await this.userModel
        .find()
        .select('guid username email password role createdAt updatedAt');
      return users;
    } catch (error) {
      throw new NotFoundException('Belum Ada Users yang mendaftar');
    }
  }

  async getUsersByGuidUsers(guid: string): Promise<User | any> {
    const user = await this.userModel
      .findOne({ guid })
      .select('guid username email password role createdAt updatedAt');

    if (!user) {
      throw new NotFoundException(
        'Gagal mendapatkan data users, guid tidak ditemukan!',
      );
    }

    return user;
  }

  async updateUserByGuid(guid: string, payload: UpdateUserDto): Promise<void> {
    await this.validateDuplicatedData(payload.email, guid);

    const updatedAt = new Date().toISOString();
    const updatedUser = await this.userModel.findOneAndUpdate(
      { guid },
      {
        ...payload,
        updatedAt,
      },
      { new: true },
    );

    if (!updatedUser) {
      throw new NotFoundException(
        'Gagal Update data users, guid tidak ditemukan!',
      );
    }
  }

  async deleteUsersByGuid(guid: string): Promise<void> {
    const deletedUser = await this.userModel.findOneAndDelete({ guid });
    if (!deletedUser) {
      throw new NotFoundException(
        'Gagal hapus data users, guid tidak ditemukan!',
      );
    }
  }

  async validateDuplicatedData(
    email: string,
    guid: string = null,
  ): Promise<void> {
    const sameEmail = await this.userModel.findOne({ email });

    if (sameEmail && sameEmail.guid !== guid) {
      throw new BadRequestException(
        'Email Telah digunakan, mohon ganti Email anda!',
      );
    }
  }

  async validateUserCredentials(payload: LoginDto): Promise<object> {
    const { username, password } = payload;

    const user = await this.userModel.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('Username Tidak Valid');
    }

    const matches = await bcrypt.compare(password, user.password);

    if (!matches) {
      throw new UnauthorizedException('Password Tidak Valid');
    }

    return {
      guid: user.guid,
      username: user.username,
      role: user.role,
    };
  }
}
