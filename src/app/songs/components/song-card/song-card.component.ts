import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Song } from '../../models/song.model';

@Component({
  selector: 'app-song-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './song-card.component.html',
  styleUrls: ['./song-card.component.scss']
})
export class SongCardComponent {
  @Input() song!: Song;
  @Output() songSelected = new EventEmitter<Song>();

  getGenreClass(genre: string): string {
    const genreMap: { [key: string]: string } = {
      'Rock': 'genre-rock',
      'Pop': 'genre-pop',
      'Jazz': 'genre-jazz',
      'Electronic': 'genre-electronic',
      'Classical': 'genre-classical',
      'Hip Hop': 'genre-hiphop',
      'Reggae': 'genre-reggae',
      'Folk': 'genre-folk',
      'Metal': 'genre-metal',
      'Country': 'genre-country',
      'Blues': 'genre-blues'
    };

    return genreMap[genre] || 'genre-other';
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
}
