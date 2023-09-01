import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { RoleGuard } from 'src/utils/guards/Roles.guard';
import { CreateAuthorDto } from './dto/create-author.dto';
import { Roles } from 'src/utils/decorators/custom.decorator';
import { Role } from 'src/schema/users.schema';
import { UpdateAuthorDto } from './dto/update-author.dto';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Roles(Role.ADMIN)
  @Post()
  async createMusicianHandler(
    @Body() payload: CreateAuthorDto,
  ): Promise<object> {
    const musicianGuid = await this.authorService.createAuthor(payload);

    return {
      status: HttpStatus.CREATED,
      message: 'Berhasil menambahkan musisi',
      data: {
        musicianGuid,
      },
    };
  }

  @Get()
  async getAllMusicianHandler(): Promise<object> {
    const data = await this.authorService.getAllAuthor();

    return {
      status: HttpStatus.OK,
      message: 'Berhasil Get All Data Musisi',
      data,
    };
  }

  @Get('/:guid')
  async getMusicianByGuidHandler(@Param('guid') guid: string): Promise<object> {
    const data = await this.authorService.getAuthorByGuid(guid);

    return {
      status: HttpStatus.OK,
      message: 'Berhasil Get Data Musisi',
      data,
    };
  }

  @Get('/:guid/withsongs')
  async getMusicianWithSongsByGuidHandler(
    @Param('guid') guid: string,
  ): Promise<object> {
    const data = await this.authorService.getAuthorWithSongByGuid(guid);

    return {
      status: HttpStatus.OK,
      message: 'Berhasil Get Data Musisi',
      data,
    };
  }

  @Roles(Role.ADMIN)
  @Put('/:guid')
  async putMusicianByGuidHandler(
    @Param('guid') guid: string,
    @Body() payload: UpdateAuthorDto,
  ): Promise<object> {
    const musicianGuid = await this.authorService.updateAuthorByGuid(
      guid,
      payload,
    );
    return {
      status: HttpStatus.OK,
      message: 'Berhasil Update Data Musisi',
      data: {
        musicianGuid,
      },
    };
  }

  @Roles(Role.ADMIN)
  @Delete('/:guid')
  async deleteMusicianByguidHandler(
    @Param('guid') guid: string,
  ): Promise<object> {
    await this.authorService.deleteAuthorByGuid(guid);

    return {
      status: HttpStatus.OK,
      message: 'Berhasil Delete Data Musisi',
    };
  }
}
