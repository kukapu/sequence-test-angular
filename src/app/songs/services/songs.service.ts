import { Artist } from '../../artists/models/artist.model';
import { Genre, Song } from './../models/song.model';
import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';

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

interface Company {
  id: string;
  name: string;
  country: string;
  createYear: number;
  employees: number;
  rating: number;
  songs: number[];
}

@Injectable({
  providedIn: 'root'
})
export class SongsService {
  private readonly SONGS_ENDPOINT = 'songs';
  private readonly ARTISTS_ENDPOINT = 'artists';
  private readonly COMPANIES_ENDPOINT = 'companies';
  private apiService = inject(ApiService);

  async getAllSongs(): Promise<Song[]> {
    return this.getSongs(1, 10000);
  }

  async getSongs(page = 1, pageSize = 20): Promise<Song[]> {
    try {
      const start = (page - 1) * pageSize;
      const songsDB = await this.apiService.get<SongDB[]>(this.SONGS_ENDPOINT, {
        _start: start,
        _limit: pageSize
      });

      const songs = await Promise.all(songsDB.map(async song => {
        const artist = await this._getArtistById(song.artist);
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
      const song = await this.apiService.get<SongDB>(`${this.SONGS_ENDPOINT}/${id}`);
      const artist = await this._getArtistById(song.artist);
      const companies = await this._getCompaniesForSong(id);

      return {
        ...song,
        artist,
        country: companies[0]?.country,
        companies: companies?.map(c => c.name)
      };
    } catch (error) {
      console.error(`Error fetching song with id ${id}:`, error);
      throw error;
    }
  }

  private async _getArtistById(artistId: number): Promise<Artist> {
    try {
      return this.apiService.get<Artist>(`${this.ARTISTS_ENDPOINT}/${artistId}`);
    } catch (error) {
      console.error(`Error fetching artist with id ${artistId}:`, error);
      throw error;
    }
  }

  private async _getCompaniesForSong(songId: number): Promise<Company[]> {
    try {
      const companies = await this.apiService.get<Company[]>(this.COMPANIES_ENDPOINT);
      return companies.filter(company => company.songs.includes(Number(songId)));
    } catch (error) {
      console.error(`Error fetching companies for song ${songId}:`, error);
      return [];
    }
  }

  async createSong(song: Song): Promise<Song> {
    try {
      const songEntity = await this._parseModelToEntity(song);
      return this.apiService.post<SongDB, Song>(this.SONGS_ENDPOINT, songEntity);
    } catch (error) {
      console.error(`Error creating song:`, error);
      throw error;
    }
  }

  async updateSong(song: Song): Promise<Song> {
    if (!song.id) {
      throw new Error('Song id is required');
    }

    try {
      const songEntity = await this._parseModelToEntity(song);
      return this.apiService.put<SongDB, Song>(`${this.SONGS_ENDPOINT}/${song.id}`, songEntity);
    } catch (error) {
      console.error(`Error updating song with id ${song.id}:`, error);
      throw error;
    }
  }

  async deleteSong(id: number): Promise<boolean> {
    try {
      return this.apiService.delete<boolean>(`${this.SONGS_ENDPOINT}/${id}`);
    } catch (error) {
      console.error(`Error deleting song with id ${id}:`, error);
      throw error;
    }
  }

  private async _parseModelToEntity(song: Song): Promise<SongDB> {
    const artistId = await this._getArtistIdByName(song.artist as unknown as string);

    const songEntity: SongDB = {
      id: song.id,
      title: song.title,
      poster: song.poster,
      genre: song.genre,
      year: song.year,
      duration: song.duration,
      rating: song.rating,
      artist: Number(artistId)
    };
    return songEntity;
  }

  private async _getArtistIdByName(name: string): Promise<number> {
    try {
      const artists = await this.apiService.get<Artist[]>(this.ARTISTS_ENDPOINT);
      const artist = artists.find(a => a.name === name);
      if (!artist) {
        throw new Error(`Artist with name ${name} not found`);
      }
      return artist.id;
    } catch (error) {
      console.error(`Error fetching artist with name ${name}:`, error);
      throw error;
    }
  }
}
