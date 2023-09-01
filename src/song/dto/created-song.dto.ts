import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSongDto {
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
  year: number;

  @IsNotEmpty()
  price: number;
}
