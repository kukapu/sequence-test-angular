import { Component, ElementRef, OnInit, inject, viewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import { SongsService } from "../../services/songs.service";
import { Song } from "../../models/song.model";
import { Router } from "@angular/router";
import { InfiniteScrollDirective } from '../../../shared/directives/infinite-scroll.directive';
import { PaginationService } from "../../../shared/services/pagination.service";
import { SongCardComponent } from "../../components/song-card/song-card.component";
import { SkeletonCardComponent } from "../../../shared/components/skeleton-card/skeleton-card.component";

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    InfiniteScrollDirective,
    SongCardComponent,
    SkeletonCardComponent
  ],
  providers: [
    PaginationService<Song>
  ],
  templateUrl: 'songs-list.component.html',
  styleUrls: ['songs-list.component.css']
})
export class SongListComponent implements OnInit {
  private songsService = inject(SongsService);
  private router = inject(Router);
  private paginationService = inject(PaginationService<Song>);
  
  // Referencias a las señales del servicio de paginación
  songs = this.paginationService.items;
  loading = this.paginationService.loading;
  hasMore = this.paginationService.hasMore;
  
  // Referencia al contenedor de scroll
  scrollContainerRef = viewChild<ElementRef<HTMLDivElement>>('scrollcontainer');
  
  readonly pageSize = 20;

  ngOnInit() {
    this.loadSongs();
  }

  /**
   * Carga las canciones usando el servicio de paginación
   * @param loadMore Indica si se deben cargar más canciones o reiniciar
   */
  async loadSongs(loadMore = false) {
    await this.paginationService.loadData(
      (page, pageSize) => this.songsService.getSongs(page, pageSize),
      loadMore,
      this.pageSize
    );
  }

  /**
   * Manejador del evento de scroll
   */
  onScrolledToBottom() {
    if (this.hasMore() && !this.loading()) {
      this.loadSongs(true);
    }
  }

  /**
   * Navega a la página de edición de una canción
   * @param song Canción a editar
   */
  toEdit(song: Song) {
    this.router.navigate(['songs', 'edit', song.id]);
  }

  /**
   * Navega a la página de creación de una nueva canción
   */
  toNew() {
    this.router.navigate(['songs', 'new']);
  }
}
