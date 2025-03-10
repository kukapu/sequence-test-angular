import { Component, inject, Output, EventEmitter } from '@angular/core';
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
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
    MatListModule,
    TranslateModule
  ]
})
export class NavComponent {
  @Output() scrolled = new EventEmitter<void>();

  private router = inject(Router);
  private translate = inject(TranslateService);
  breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(
      map(result => result.matches)
    );

  menuItems = [
    { path: '/songs', label: 'NAVIGATION.SONGS', icon: 'music_note' },
    { path: '/artists', label: 'NAVIGATION.ARTISTS', icon: 'person' },
    { path: '/companies', label: 'NAVIGATION.COMPANIES', icon: 'business' }
  ];

  currentTitle$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(() => {
      const currentRoute = this.router.url;
      if (currentRoute.includes('/songs/new')) {
        return this.translate.instant('SONGS.NEW_SONG');
      } else if (currentRoute.includes('/songs/edit')) {
        return this.translate.instant('SONGS.EDIT_SONG');
      }
      const menuItem = this.menuItems.find(item => item.path === currentRoute);
      return menuItem ? this.translate.instant(menuItem.label) : this.translate.instant('NAVIGATION.SONGS');
    })
  );

  isFormRoute(): boolean {
    return this.router.url.includes('/songs/new') || this.router.url.includes('/songs/edit');
  }

  goBack() {
    this.router.navigate(['/songs']);
  }

  closeIfHandset(drawer: any) {
    if (this.breakpointObserver.isMatched('(max-width: 599px)')) {
      drawer.close();
    }
  }
}
