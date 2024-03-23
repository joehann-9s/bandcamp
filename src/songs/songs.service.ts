import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './entities/song.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID} from 'uuid';
@Injectable()
export class SongsService {

  private readonly logger = new Logger('SongsService');

  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
  ){}

  async create(createSongDto: CreateSongDto) {
    try {
      const song = this.songRepository.create(createSongDto);
      await this.songRepository.save(song);
      return song;
    } catch (error) {
      this.handleDBExceptions(error);      
    }
  }

  findAll(paginationDto: PaginationDto) {

    const { limit=10, offset=0} = paginationDto;
    return this.songRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(term: string) {
    let song: Song;
    if( isUUID(term)){
      song = await this.songRepository.findOneBy({ id : term }); 
    }else{
      const queryBuilder = this.songRepository.createQueryBuilder();
      song = await queryBuilder.where('UPPER(title) =:title',{
        title: term.toLocaleUpperCase(),
      }).getOne();
    }
    if(!song) throw new NotFoundException(`Product with term ${term} not found`);
    return song;
  }

  async update(id: string, updateSongDto: UpdateSongDto) {
    const song = await this.songRepository.preload({
      id: id,
      ...updateSongDto
    });
    if(!song) throw new NotFoundException(`Product with id: ${id} not found`);

    try {
      await this.songRepository.save(song);
      return song;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const song = await this.findOne(id);
    await this.songRepository.remove(song);
  }

  private handleDBExceptions( error: any ){
    if( error.code === '23505')
        throw new BadRequestException(error.detail);

      this.logger.error(error);
      throw new InternalServerErrorException(`Something went wrong`);
  }
}
