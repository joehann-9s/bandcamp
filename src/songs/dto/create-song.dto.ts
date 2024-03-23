import { IsArray, IsDateString, IsNumber, IsPositive, IsString, MinLength } from "class-validator";



export class CreateSongDto {
    @IsString()
    @MinLength(1)
    title: string;

    @IsString({ each:true })
    @IsArray()
    artist: string[];

    @IsString()
    album_name: string;

    @IsDateString()
    release_date: string;

    @IsString({ each:true })
    @IsArray()
    genre: string[];

    @IsNumber()
    @IsPositive()
    duration: number;

}
