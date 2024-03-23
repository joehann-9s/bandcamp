import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Song {

    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column('text')
    title: string;

    @Column('text',{ array: true, default:['unknown']})
    artist: string[];

    @Column('text')
    album_name: string;

    @Column('text')
    release_date: string;

    @Column('text',{ array: true, default:['unknown'] })
    genre: string[];

    @Column('numeric')
    duration: number;    
}
