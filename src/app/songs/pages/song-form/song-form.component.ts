import { Component, OnInit, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { GENRES, Song } from "../../models/song.model";
import { SongForm } from "../../form/song.form";
import { SongsService } from "../../services/songs.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DeleteDialogComponent } from "../../components/delete-dialog/delete-dialog.component";

@Component({
  selector: 'app-song-form',
  templateUrl: './song-form.component.html',
  styleUrls: ['./song-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    TranslateModule
  ]
})
export class SongFormComponent implements OnInit {
  private songService = inject(SongsService);
  private activeRouter = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  genres = GENRES;
  maxDate = new Date();
  songForm = new SongForm();
  filteredCountries = this.songForm.filteredCountries;
  isEditing = signal(false);
  saving = signal(false);
  isLoading = signal(false);
  songId: string | null = null;

  get form() {
    return this.songForm.form;
  }

  get yearNumberControl() {
    return this.songForm.yearNumberControl;
  }

  get yearDateControl() {
    return this.songForm.yearDateControl;
  }

  get countryFilterCtrl() {
    return this.songForm.countryFilterCtrl;
  }

  get companies() {
    return this.songForm.companies;
  }

  constructor() { }

  ngOnInit(): void {
    const id = this.activeRouter.snapshot.paramMap.get('id');
    if (id) {
      this.isLoading.set(true)
      this.songId = id;
      this.loadSong(id);
    } else {
      this.isEditing.set(true);
    }
  }

  async loadSong(id: string) {
    try {
      const song = await this.songService.getSongById(Number(id));
      this.songForm.setData(song);
      this.songForm.setEditMode(false);
    } catch (error) {
      console.error('Error loading song:', error);
    } finally {
      this.isLoading.set(false)
    }
  }

  displayFn = (country: string) => this.songForm.displayFn(country);

  onCountrySelected(event: MatAutocompleteSelectedEvent) {
    this.songForm.onCountrySelected(event.option.value);
  }

  clearCountryOnBackspace(event: KeyboardEvent) {
    const value = this.countryFilterCtrl.value;
    if (event.key === 'Backspace' && this.form.get('country')?.value && (!value || value === '')) {
      event.preventDefault();
      this.songForm.clearCountry();
    }
  }

  addCompany(company: string, input: HTMLInputElement) {
    this.songForm.addCompany(company);
    input.value = '';
  }

  removeCompany(index: number) {
    this.songForm.removeCompany(index);
  }

  removeLastGenre() {
    this.songForm.removeLastGenre();
  }

  chosenYearHandler(date: Date, datepicker: any) {
    this.songForm.onYearSelected(date.getFullYear());
    datepicker.close();
  }

  edit() {
    this.isEditing.set(true);
    this.songForm.setEditMode(true);
  }

  cancel() {
    if (this.songId) {
      this.loadSong(this.songId);
    } else {
      this.form.reset();
    }
    this.isEditing.set(false);
    this.songForm.setEditMode(false);
  }

  async save() {
    if (this.form.valid) {
      this.saving.set(true);
      try {
        const songData = this.songForm.getValue() as Song;
        if (this.songId) {
          await this.songService.updateSong({
            ...songData,
            id: Number(this.songId)
          });
        } else {
          await this.songService.createSong(songData);
        }
        this.router.navigate(['/songs']);
      } catch (error) {
        console.error('Error saving song:', error);
      } finally {
        this.saving.set(false);
      }
    }
  }

  async delete() {
    const dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe(async result => {
      if (result && this.songId) {
        try {
          await this.songService.deleteSong(Number(this.songId));
          this.router.navigate(['/songs']);
        } catch (error) {
          console.error('Error deleting song:', error);
        }
      }
    });
  }

  onSelectOpened(opened: boolean): boolean {
    if (!this.isEditing()) {
      return false;
    }
    return opened;
  }
}
