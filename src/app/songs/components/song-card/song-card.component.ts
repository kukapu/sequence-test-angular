import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Song } from '../../models/song.model';

@Component({
  selector: 'app-song-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule
  ],
  template: `
    <mat-card class="song-card" (click)="songSelected.emit(song)">
      <mat-card-header>
        <mat-card-title>{{ song.title }}</mat-card-title>
        <mat-card-subtitle>{{ song.artist.name }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="genre-chips">
          @for (genre of song.genre; track genre) {
            <mat-chip selected>{{ genre }}</mat-chip>
          }
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .song-card {
      cursor: pointer;
      transition: transform 0.2s ease-in-out;
    }
    
    .song-card:hover {
      transform: translateY(-5px);
    }
    
    mat-card-title {
      font-size: 22px;
      font-weight: 500;
    }
    
    .genre-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 16px;
    }
  `]
})
export class SongCardComponent {
  @Input({ required: true }) song!: Song;
  @Output() songSelected = new EventEmitter<Song>();
}
