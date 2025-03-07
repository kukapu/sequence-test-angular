import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'songs', pathMatch: 'full' },
  { 
    path: 'songs', 
    loadChildren: () => import('./songs/songs.routes').then(m => m.SONGS_ROUTES) 
  },
  // { 
  //   path: 'artists', 
  //   loadChildren: () => import('./features/artists/artists.routes').then(m => m.ARTISTS_ROUTES) 
  // },
  // { 
  //   path: 'companies', 
  //   loadChildren: () => import('./features/companies/companies.routes').then(m => m.COMPANIES_ROUTES) 
  // },
  { path: '**', redirectTo: 'songs' }
];