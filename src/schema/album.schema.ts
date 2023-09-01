import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Album {
  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  guid: string;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: Number })
  year: number;

  @Prop({ required: true, type: String })
  author: string;

  @Prop({ type: [{ type: String, ref: 'Song' }] })
  songs: string[];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
