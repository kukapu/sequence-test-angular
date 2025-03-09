import { Component, OnInit, inject } from "@angular/core";
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
import { GENRES, Song } from "../../models/song.model";
import { SongForm } from "../../form/song.form";
import { SongsService } from "../../services/songs.service";
import { ActivatedRoute, Router } from "@angular/router";

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
    MatAutocompleteModule
  ]
})
export class SongFormComponent implements OnInit {
  private songService = inject(SongsService);
  private activeRouter = inject(ActivatedRoute);
  private router = inject(Router)

  genres = GENRES;
  maxDate = new Date();
  songForm = new SongForm();
  filteredCountries = this.songForm.filteredCountries;

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
      if (year !== null) {
        this.form.patchValue({ year: year.toString() });
      }
    });
  }

  async loadInfo() {
    this.activeRouter.params.subscribe(async params => {
      if (params['id']) {
        const data = await this.songService.getSongById(params['id']);
        this.songForm.setData(data);
      }
    });
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

  async onSubmit() {
    if (!this.form.valid) return;

    const songData = this.songForm.getValue();
    songData.id
      ? await this.songService.updateSong(songData as Song)
      : await this.songService.createSong(songData as Song)

    this.back()
  }
}
