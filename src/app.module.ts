import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { SongModule } from './song/song.module';
import { AuthorModule } from './author/author.module';
import { AlbumModule } from './album/album.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    SongModule,
    AuthorModule,
    AlbumModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
