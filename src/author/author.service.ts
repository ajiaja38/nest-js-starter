import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Author } from 'src/schema/author.schema';
import { CreateAuthorDto } from './dto/create-author.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorService {
  constructor(
    @InjectModel(Author.name)
    private readonly authorModel: mongoose.Model<Author>,
  ) {}

  async createAuthor(payload: CreateAuthorDto): Promise<string> {
    try {
      const { name } = payload;
      await this.validateDuplicatedAuthorName(name);

      const guid = `Author-${uuidv4()}`;
      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;

      const schema = {
        guid,
        name,
        createdAt,
        updatedAt,
      };

      const createdAuthor = new this.authorModel(schema);
      await createdAuthor.save();

      return createdAuthor.guid;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Gagal Mendaftarkan Musisi, kesalahan pada server',
      );
    }
  }

  async getAllAuthor(): Promise<Author[] | any> {
    const Authors = await this.authorModel.find();

    if (!Authors.length) {
      throw new NotFoundException('Belum Ada Author yang terdaftar');
    }

    return Authors;
  }

  async getAuthorByGuid(guid: string): Promise<Author | any> {
    const Author = await this.authorModel.findOne({ guid });

    if (!Author) {
      throw new NotFoundException(
        'Musisi tidak ditemukan, Guid Tidak Terdaftar!',
      );
    }

    return Author;
  }

  async getAuthorWithSongByGuid(guid: string): Promise<Author | any> {
    try {
      const author = await this.authorModel.aggregate([
        {
          $match: { guid },
        },
        {
          $lookup: {
            from: 'songs',
            localField: 'guid',
            foreignField: 'author',
            as: 'songs',
          },
        },
        {
          $project: {
            _id: 0,
            guid: 1,
            name: 1,
            createdAt: 1,
            updatedAt: 1,
            songs: {
              guid: 1,
              title: 1,
              genre: 1,
              year: 1,
              price: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        },
      ]);

      return author.length ? author[0] : [];
    } catch (error) {
      console.log(error);
      throw new error();
    }
  }

  async updateAuthorByGuid(
    guid: string,
    payload: UpdateAuthorDto,
  ): Promise<string | any> {
    try {
      await this.validateDuplicatedAuthorName(payload.name, guid);
      const updateAuthor = await this.authorModel.findOneAndUpdate(
        { guid },
        { ...payload },
        { new: true },
      );

      return updateAuthor.guid;
    } catch (error) {
      throw new NotFoundException('Gagal Update Musisi, Guid Tidak Ditemukan!');
    }
  }

  async deleteAuthorByGuid(guid: string): Promise<void> {
    try {
      await this.authorModel.findOneAndDelete({ guid });
    } catch (error) {
      throw new NotFoundException('Gagal Delete Musisi, Guid Tidak Ditemukan!');
    }
  }

  async validateDuplicatedAuthorName(
    name: string,
    guid: string = null,
  ): Promise<void> {
    const sameName = await this.authorModel.findOne({ name });

    if (sameName && sameName.guid !== guid) {
      throw new BadRequestException('Nama Musisi Telah Terdaftar!');
    }
  }
}
