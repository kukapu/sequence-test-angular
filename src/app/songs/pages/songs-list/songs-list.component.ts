import { Component, ElementRef, inject, signal, viewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { SongsService } from "../../services/songs.service";
import { Song } from "../../models/song.model";
import { Router } from "@angular/router";

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    InfiniteScrollDirective
  ],
  templateUrl: 'songs-list.component.html',
  styleUrls: ['songs-list.component.css']
})
export class SongListComponent {
  private songsService = inject(SongsService);
  private router = inject(Router);
  songs = signal<Song[]>([]);
  page = signal(1);
  loading = signal(false);
  hasMore = signal(true);
  readonly pageSize = 20;

  scrollContainerRef = viewChild<ElementRef<HTMLDivElement>>('scrollcontainer')

  ngOnInit() {
    this.loadSongs();
  }

  async loadSongs(loadMore = false) {
    if (this.loading() || (!loadMore && !this.hasMore())) return;

    try {
      this.loading.set(true);

      if (!loadMore) {
        this.page.set(1);
        this.songs.set([]);
        this.hasMore.set(true);
      }

      const data = await this.songsService.getSongs(this.page(), this.pageSize);
      console.log(data)
      
      if (data.length === 0) {
        this.hasMore.set(false);
        return;
      }
      
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

  onScroll(event: Event) {
    const container = this.scrollContainerRef()?.nativeElement;
    if (!container) return;

    const topScroll = container?.scrollTop;
    const containerHeight = container?.clientHeight;
    const scrollHeight = container?.scrollHeight;

    if (topScroll + containerHeight >= scrollHeight - 150 && this.hasMore() && !this.loading()) {
      this.loadSongs(true);
    }
  }

  toEdit(song: Song) {
    this.router.navigate(['songs', 'edit', song.id]);
  }

  toNew() {
    this.router.navigate(['songs', 'new']);
  }
}
