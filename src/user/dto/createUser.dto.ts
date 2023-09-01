import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Role } from '../../schema/users.schema';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password harus lebih dari 5 Karakter' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password terlalu lemah, Wajib Kombinasi A-z & Karakter',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @IsOptional()
  @IsString()
  role: Role;
}
