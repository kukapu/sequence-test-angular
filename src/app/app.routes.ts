import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'songs', pathMatch: 'full' },
  {
    path: 'songs',
    loadChildren: () => import('./songs/songs.routes').then(m => m.SONGS_ROUTES)
  },
  {
    path: 'artists',
    loadComponent: () => import('./artists/pages/artist-list/artist-list.component').then(m => m.ArtistListComponent)
  },
  {
    path: 'companies',
    loadComponent: () => import('./companies/pages/company-list/company-list.component').then(m => m.CompanyListComponent)
  },
  {
    path: '',
    redirectTo: 'songs',
    pathMatch: 'full'
  }
];
