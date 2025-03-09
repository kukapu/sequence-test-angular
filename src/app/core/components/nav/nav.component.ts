import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    RouterModule
  ],
  template: `
    <mat-toolbar>
      <button mat-icon-button (click)="toggleMenu()">
        <mat-icon>menu</mat-icon>
      </button>
      @if (isFormRoute()) {
        <button mat-icon-button routerLink="/songs">
          <mat-icon>arrow_back</mat-icon>
        </button>
      }
      <span class="title">{{ getTitle() | translate }}</span>
    </mat-toolbar>
  `,
  styles: [`
    mat-toolbar {
      height: 64px;
      padding: 0 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background-color: var(--mdc-filled-button-container-color, #3f51b5);
      color: white;
    }

    .title {
      margin-left: 0.5rem;
      font-size: 1.25rem;
      font-weight: 500;
    }

    button {
      color: white;
    }
  `]
})
export class NavComponent {
  @Output() menuToggle = new EventEmitter<void>();
  private router = inject(Router);

  toggleMenu() {
    this.menuToggle.emit();
  }

  isFormRoute(): boolean {
    return this.router.url.includes('/songs/new') || this.router.url.includes('/songs/edit');
  }

  getTitle(): string {
    if (this.router.url.includes('/songs/new')) {
      return 'SONGS.NEW_SONG';
    } else if (this.router.url.includes('/songs/edit')) {
      return 'SONGS.EDIT_SONG';
    }
    return 'NAVIGATION.SONGS';
  }
}
