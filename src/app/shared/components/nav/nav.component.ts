import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule
  ]
})
export class NavComponent {
  private router = inject(Router);
  breakpointObserver = inject(BreakpointObserver)

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(
      map(result => result.matches)
    );

  menuItems = [
    { path: '/songs', label: 'Canciones', icon: 'music_note' },
    { path: '/artists', label: 'Artistas', icon: 'person' },
    { path: '/companies', label: 'Compañías', icon: 'business' }
  ];

  currentTitle$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(() => {
      const currentRoute = this.router.url;
      return this.menuItems.find(item => item.path === currentRoute)?.label ?? 'Canciones';
    })
  );

  closeIfHandset(drawer: any) {
    if (this.breakpointObserver.isMatched('(max-width: 599px)')) {
      drawer.close();
    }
  }
}
