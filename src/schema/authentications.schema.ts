import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Auth {
  @Prop({ type: String, required: true })
  guidUser: string;

  @Prop({ type: String, required: true, unique: true })
  refreshToken: string;

  @Prop({ type: Date, required: true })
  expiryDate: Date;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
