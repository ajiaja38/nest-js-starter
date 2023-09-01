import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateSongDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsString()
  genre: string;

  @IsNotEmpty()
  @IsInt()
  year: number;

  @IsNotEmpty()
  @IsInt()
  price: number;
}
