import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'songs', pathMatch: 'full' },
  {
    path: 'songs',
    loadChildren: () => import('./songs/songs.routes')
  },
  {
    path: 'artists',
    loadComponent: () => import('./artists/pages/artist-list/artist-list.component')
  },
  {
    path: 'companies',
    loadComponent: () => import('./companies/pages/company-list/company-list.component')
  },
  {
    path: '**',
    redirectTo: 'songs',
  }
];
