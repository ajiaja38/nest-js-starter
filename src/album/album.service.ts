import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Album } from 'src/schema/album.schema';
import { CreateAlbumDto } from './dto/create-album.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name)
    private readonly albumModel: mongoose.Model<Album>,
  ) {}

  async createAlbum(payload: CreateAlbumDto): Promise<string | any> {
    const { title, year, author } = payload;
    const guid = `Albums-${uuidv4()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const schema = {
      guid,
      title,
      year,
      author,
      songs: [],
      createdAt,
      updatedAt,
    };

    const album = new this.albumModel(schema);
    album.save();

    return album.guid;
  }

  async getAllAlbum(): Promise<Album[] | any> {
    const albums = await this.albumModel.find();

    if (!albums.length) {
      throw new NotFoundException('Belum Ada Album Yang Terdaftar!');
    }

    return albums;
  }

  async getAlbumByGuid(guid: string): Promise<Album> {
    const album = await this.albumModel.findOne({ guid });

    if (!album) {
      throw new NotFoundException(
        'Gagal Mendapatkan Data album, Guid tidak ditemukan!',
      );
    }

    return album;
  }
}
