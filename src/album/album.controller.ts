import {
  Controller,
  UseGuards,
  Body,
  HttpStatus,
  Post,
  Get,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { RoleGuard } from 'src/utils/guards/Roles.guard';
import { Roles } from 'src/utils/decorators/custom.decorator';
import { Role } from 'src/schema/users.schema';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Roles(Role.ADMIN)
  @Post()
  async postAlbumHandler(@Body() payload: CreateAlbumDto): Promise<object> {
    const guidAlbum = await this.albumService.createAlbum(payload);

    return {
      code: HttpStatus.CREATED,
      status: true,
      message: 'Berhasil create',
      data: {
        guidAlbum,
      },
    };
  }

  @Get()
  async getAllAlbumHandler(): Promise<object> {
    const data = await this.albumService.getAllAlbum();

    return {
      code: HttpStatus.OK,
      status: true,
      message: 'Berhasil Get Data Albums',
      data,
    };
  }
}
