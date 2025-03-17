import { Routes } from '@angular/router';
import { SongFormComponent } from './pages/song-form/song-form.component';
import { SongListComponent } from './pages/songs-list/songs-list.component';

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


export default SONGS_ROUTES;