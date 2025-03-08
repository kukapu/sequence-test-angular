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
  private readonly API_URL = 'http://localhost:3000/songs';
  private readonly API_URL_ARTISTS = 'http://localhost:3000/artists';
  private readonly API_URL_COMPANIES = 'http://localhost:3000/companies';

  constructor() { }

  async getAllSongs() {
    return this.getSongs(1, 10000)
  }

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
      const artist = await this._getArtistFromSong(song.artist as any);
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

  private async _getCompaniesForSong(songId: number): Promise<Company[]> {
    try {
      const response = await fetch(`${this.API_URL_COMPANIES}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const companies = await response.json() as Company[];
      return companies.filter(company => company.songs.includes(Number(songId)));

    } catch (error) {
      console.error(`Error fetching companies for song ${songId}:`, error);
      return [];
    }
  }

  async createSong(song: Song){
    try {
      const response = await fetch(`${this.API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(song)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error creating song`, error);
      throw error;
    }
  }
}
