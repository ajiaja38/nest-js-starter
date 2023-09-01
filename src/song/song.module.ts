import { Module } from '@nestjs/common';
import { SongService } from './song.service';
import { SongController } from './song.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Song, SongSchema } from 'src/schema/songs.schema';
import { AuthorModule } from 'src/author/author.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Song.name, schema: SongSchema }]),
    AuthorModule,
  ],
  controllers: [SongController],
  providers: [SongService],
})
export class SongModule {}
