import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ],
  template: `
    <h2 mat-dialog-title>{{ 'SONGS.DELETE_TITLE' | translate }}</h2>
    <mat-dialog-content>
      <p>{{ 'SONGS.DELETE_MESSAGE' | translate }}</p>
      <p>{{ 'SONGS.DELETE_WARNING' | translate }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">{{ 'COMMON.CANCEL' | translate }}</button>
      <button mat-raised-button color="warn" (click)="onYesClick()">
        <mat-icon>delete</mat-icon>
        <span>{{ 'COMMON.DELETE' | translate }}</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 300px;
    }

    mat-dialog-actions {
      padding: 1rem;
      gap: 0.5rem;
    }

    button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `]
})
export class DeleteDialogComponent {
  private dialogRef = inject(MatDialogRef<DeleteDialogComponent>);

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
