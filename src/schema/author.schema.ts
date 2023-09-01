import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Author {
  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  guid: string;

  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
