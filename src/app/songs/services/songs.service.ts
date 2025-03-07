import { Genre, Song } from './../models/song.model';
import { Injectable } from '@angular/core';

interface SongDB {
  id: number,
  title: string,
  poster: string,
  genre: Genre[],
  year: number,
  duration: number,
  rating: number,
  artist: number,
}

@Injectable({
  providedIn: 'root'
})
export class SongsService {
  private readonly API_URL = 'http://localhost:3000/songs';
  private readonly API_URL_ARTISTS = 'http://localhost:3000/artists';

  constructor() { }

  async getSongs(page = 1, pageSize = 20): Promise<Song[]> {
    try {
      const start = (page - 1) * pageSize;
      const response = await fetch(`${this.API_URL}?_start=${start}&_limit=${pageSize}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const songsDB = await response.json() as SongDB[];

      const songs = await Promise.all(songsDB.map(async song => {
        const artist = await this._getArtistFromSong(song.artist);
        return {
          ...song,
          artist
        };
      }));

      return songs;

    } catch (error) {
      console.error('Error fetching songs:', error);
      throw error;
    }
  }

  async getSongById(id: number): Promise<Song> {
    try {
      const response = await fetch(`${this.API_URL}/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const song = await response.json() as Song;
      return song;

    } catch (error) {
      console.error(`Error fetching song with id ${id}:`, error);
      throw error;
    }
  }

  private async _getArtistFromSong(artistId: number){
    try {
      const response = await fetch(`${this.API_URL_ARTISTS}/${artistId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json()

    } catch (error) {
      console.error(`Error fetching song with id ${artistId}:`, error);
      throw error;
    }
  }
}
