import { Routes } from '@angular/router';
import { SongListComponent } from './songs-list/songs-list.component';
import { SongFormComponent } from './song-form/song-form.component';

export const SONGS_ROUTES: Routes = [
  {
    path: '',
    component: SongListComponent
  },
  {
    path: 'new',
    component: SongFormComponent
  },
  {
    path: 'edit/:id',
    component: SongFormComponent
  }
];