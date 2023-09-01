import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Song {
  @Prop({
    required: true,
    type: String,
    unique: true,
  })
  guid: string;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  author: string;

  @Prop({ required: true, type: String })
  genre: string;

  @Prop({ required: true, type: Number })
  year: number;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const SongSchema = SchemaFactory.createForClass(Song);
