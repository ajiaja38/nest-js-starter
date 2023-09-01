import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from '../../schema/users.schema';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  role: Role;
}
