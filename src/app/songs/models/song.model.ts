import { Artist } from "../../artists/models/artist.model";

export interface Song {
  id: number,
  title: string,
  poster: string,
  genre: Genre[],
  year: number,
  duration: number,
  rating: number,
  artist: Artist,
}

export const GENRES = [
  'Pop',
  'Rock',
  'Alternative',
  'Chill',
  'Heavy',
  'Romance',
  'Blues',
  'Psychedelic rock'
] as const;
export type Genre = typeof GENRES[number];
