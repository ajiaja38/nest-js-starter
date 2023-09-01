import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { SongService } from './song.service';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { RoleGuard } from 'src/utils/guards/Roles.guard';
import { Roles } from 'src/utils/decorators/custom.decorator';
import { Role } from 'src/schema/users.schema';
import { CreateSongDto } from './dto/created-song.dto';
import { UpdateSongDto } from './dto/updated-song.dto';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('song')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Roles(Role.ADMIN)
  @Post()
  async createSongHandler(@Body() payload: CreateSongDto): Promise<object> {
    const songGuid = await this.songService.createSong(payload);
    return {
      status: HttpStatus.CREATED,
      message: 'Berhasil Menambahkan Lagu Baru',
      data: {
        songGuid,
      },
    };
  }

  @Get()
  async getAllSongHandler(): Promise<object> {
    const data = await this.songService.getAllSongs();
    return {
      status: HttpStatus.OK,
      message: 'Berhasil Get All Data Lagu',
      data,
    };
  }

  @Get('/:guid')
  async getSongByGuidHandler(@Param('guid') guid: string): Promise<object> {
    const data = await this.songService.getSongByGuid(guid);
    return {
      status: HttpStatus.OK,
      message: 'Berhasil Get Data Lagu',
      data,
    };
  }

  @Roles(Role.ADMIN)
  @Put('/:guid')
  async updateSongByGuidHandler(
    @Param('guid') guid: string,
    @Body() payload: UpdateSongDto,
  ): Promise<object> {
    const songGuid = await this.songService.updateSongByGuid(guid, payload);
    return {
      status: HttpStatus.OK,
      message: 'Berhasil Update Data Lagu',
      data: {
        songGuid,
      },
    };
  }

  @Roles(Role.ADMIN)
  @Delete('/:guid')
  async deleteSongHandler(@Param('guid') guid: string): Promise<object> {
    await this.songService.deleteSongByGuid(guid);
    return {
      status: HttpStatus.OK,
      message: 'Berhasil Delete Data Lagu',
    };
  }
}
