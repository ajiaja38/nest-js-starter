import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Author, AuthorSchema } from 'src/schema/author.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Author.name, schema: AuthorSchema }]),
  ],
  controllers: [AuthorController],
  providers: [AuthorService],
  exports: [AuthorService],
})
export class AuthorModule {}
