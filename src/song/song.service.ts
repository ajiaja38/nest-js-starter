import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AuthorService } from 'src/author/author.service';
import { Song } from 'src/schema/songs.schema';
import { CreateSongDto } from './dto/created-song.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateSongDto } from './dto/updated-song.dto';

@Injectable()
export class SongService {
  constructor(
    @InjectModel(Song.name)
    private readonly songModel: mongoose.Model<Song>,

    @Inject(AuthorService)
    private readonly authorService: AuthorService,
  ) {}

  async createSong(payload: CreateSongDto): Promise<string> {
    await this.authorService.getAuthorByGuid(payload.author);

    const guid = `Songs-${uuidv4()}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const schema = {
      guid,
      ...payload,
      createdAt,
      updatedAt,
    };

    const createSong = new this.songModel(schema);
    await createSong.save();

    if (!createSong.save()) {
      throw new Error();
    }

    return createSong.guid;
  }

  async getAllSongs(): Promise<Song[] | any> {
    const songs = await this.songModel.find();

    if (!songs.length) {
      throw new NotFoundException('Belum ada Lagu Yang terdaftar!');
    }

    return songs;
  }

  async getSongByGuid(guid: string): Promise<Song | any> {
    const song = await this.songModel.findOne({ guid });

    if (!song) {
      throw new NotFoundException('Gagal Mendapat Lagu, Guid Tidak Ditemukan!');
    }
  }

  async updateSongByGuid(
    guid: string,
    payload: UpdateSongDto,
  ): Promise<string> {
    try {
      await this.authorService.getAuthorByGuid(payload.author);
      const updateSong = await this.songModel.findOneAndUpdate(
        { guid },
        { ...payload },
        { new: true },
      );

      return updateSong.guid;
    } catch (error) {
      throw new NotFoundException('Gagal Update Lagu, Guid Tidak Ditemukan!');
    }
  }

  async deleteSongByGuid(guid: string): Promise<void> {
    try {
      await this.songModel.findOneAndDelete({ guid });
    } catch (error) {
      throw new NotFoundException('Gagal Hapus Lagu, Guid Tidak Ditemukan!');
    }
  }
}
