import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { SongsService } from "../../services/songs.service";
import { Song } from "../../models/song.model";

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    InfiniteScrollDirective
  ],
  templateUrl: 'songs-list.component.html',
  styleUrls: ['songs-list.component.css']
})
export class SongListComponent {
  private songsService = inject(SongsService);
  songs = signal<Song[]>([]);
  page = signal(1);
  loading = signal(false);
  hasMore = signal(true);
  readonly pageSize = 20;

  ngOnInit() {
    this.loadSongs();
  }

  async loadSongs(loadMore = false) {
    if (this.loading()) return;

    try {
      this.loading.set(true);

      if (!loadMore) {
        this.page.set(1);
        this.songs.set([]);
      }

      const data = await this.songsService.getSongs(this.page(), this.pageSize);
      console.log(data)
      this.songs.update(songs => [...songs, ...data]);

      if (data.length === this.pageSize) {
        this.page.update(p => p + 1);
        this.hasMore.set(true);
      } else {
        this.hasMore.set(false);
      }

    } catch (error) {
      console.error('Error loading songs:', error);
    } finally {
      this.loading.set(false);
    }
  }

  onScroll() {
    console.log('onScroll called', { hasMore: this.hasMore(), loading: this.loading() });
    if (this.hasMore() && !this.loading()) {
      console.log('Loading more songs...');
      this.loadSongs(true);
    }
  }
}
