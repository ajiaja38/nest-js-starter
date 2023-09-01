import {
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAlbumDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  year: number;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  songs: string[];
}
