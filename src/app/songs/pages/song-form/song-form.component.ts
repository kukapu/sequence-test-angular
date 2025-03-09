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
    MatDialogModule
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
  isExistingSong = signal(false);

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

  get companiesArray() {
    return this.songForm.companiesArray;
  }

  constructor() { }

  ngOnInit(): void {
    this.loadInfo();

    this.yearNumberControl.valueChanges.subscribe(year => {
      if (year !== null && this.isEditing()) {
        this.form.patchValue({ year: year.toString() });
      }
    });
  }

  async loadInfo() {
    this.activeRouter.params.subscribe(async params => {
      if (params['id']) {
        const data = await this.songService.getSongById(params['id']);
        this.songForm.setData(data);
        this.isExistingSong.set(true);
        this.isEditing.set(false);
        this.form.disable();
        this.yearNumberControl.disable();
        this.yearDateControl.disable();
        this.countryFilterCtrl.disable();
      } else {
        this.isExistingSong.set(false);
        this.isEditing.set(true);
        this.form.enable();
        this.yearNumberControl.enable();
        this.yearDateControl.enable();
        this.countryFilterCtrl.enable();
      }
    });
  }

  displayFn = (country: string) => this.songForm.displayFn(country);

  onCountrySelected(event: MatAutocompleteSelectedEvent) {
    if (!this.isEditing()) return;
    this.songForm.onCountrySelected(event.option.value);
  }

  clearCountryOnBackspace(event: KeyboardEvent) {
    if (!this.isEditing()) return;

    const value = this.countryFilterCtrl.value;
    if (event.key === 'Backspace' && this.form.get('country')?.value && (!value || value === '')) {
      event.preventDefault();
      this.songForm.clearCountry();
    }
  }

  addCompany(company: string, input: HTMLInputElement) {
    if (this.songForm.addCompany(company)) {
      input.value = '';
    }
  }

  removeCompany(index: number) {
    this.songForm.removeCompany(index);
  }

  removeLastGenre() {
    this.songForm.removeLastGenre();
  }

  onYearSelected(date: Date) {
    this.songForm.onYearSelected(date.getFullYear());
  }

  back(){
    this.router.navigate(['songs']);
  }

  enableEdit() {
    this.isEditing.set(true);
    this.form.enable();
    this.yearNumberControl.enable();
    this.yearDateControl.enable();
    this.countryFilterCtrl.enable();
  }

  async deleteSong() {
    if (!this.form.value.id) return;

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms'
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.songService.deleteSong(Number(this.form.value.id));
        this.back();
      }
    });
  }

  async onSubmit() {
    if (!this.form.valid) return;

    const songData = this.songForm.getValue();
    songData.id
      ? await this.songService.updateSong(songData as Song)
      : await this.songService.createSong(songData as Song)

    this.back()
  }
}
