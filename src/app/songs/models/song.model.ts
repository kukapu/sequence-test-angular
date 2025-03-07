export interface Song {
  id: number,
  title: string,
  poster: string,
  genere: Genre[],
  year: number,
  duration: number,
  rating: number,
  artist: number,
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
