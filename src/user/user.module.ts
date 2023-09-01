import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UsersSchema } from '../schema/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
