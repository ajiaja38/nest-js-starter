import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

@Schema()
export class User {
  @Prop({
    type: String,
    unique: true,
    required: true,
  })
  guid: string;

  @Prop({ type: String, required: true })
  username: string;

  @Prop({
    type: String,
    unique: true,
    required: true,
  })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({
    type: String,
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UsersSchema = SchemaFactory.createForClass(User);
