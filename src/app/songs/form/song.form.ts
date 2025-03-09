import { inject, signal } from "@angular/core";
import { FormArray, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Song } from "../models/song.model";

export class SongForm {
  private fb = inject(FormBuilder);
  private readonly countries = ['España', 'Estados Unidos', 'Reino Unido', 'Francia', 'Alemania', 'Italia', 'Japón'];

  yearNumberControl = new FormControl<number | null>(null);
  yearDateControl = new FormControl<Date | null>(null);
  countryFilterCtrl = new FormControl<string>('');
  companies = signal<string[]>([]);
  filteredCountries = signal<string[]>(this.countries);

  form = this.fb.group({
    id: [''],
    title: ['', [Validators.required]],
    artist: ['', [Validators.required]],
    poster: [''],
    genre: [[] as string[]],
    companies: this.fb.array([]),
    country: [''],
    duration: [0],
    year: [''],
    rating: ['', [
      Validators.required,
      Validators.min(0),
      Validators.max(10),
      Validators.pattern(/^\d*\.?\d{0,2}$/)
    ]]
  });

  constructor() {
    this.countryFilterCtrl.valueChanges.subscribe(filterValue => {
      if (filterValue !== null) {
        const filter = filterValue.toLowerCase();
        this.filteredCountries.set(
          this.countries.filter(country =>
            country.toLowerCase().includes(filter)
          )
        );
      }
    });

    this.form.get('country')?.valueChanges.subscribe(value => {
      if (value !== this.countryFilterCtrl.value) {
        this.countryFilterCtrl.setValue(value || '', { emitEvent: false });
      }
    });
  }

  get companiesArray() {
    return this.form.get('companies') as FormArray;
  }

  displayFn(country: string): string {
    return country || '';
  }

  setData(song: Song) {
    console.log('song desde el form', song)
    this.form.patchValue({
      id: song.id.toString(),
      title: song.title,
      artist: song.artist.name,
      poster: song.poster,
      genre: song.genre,
      duration: song.duration,
      country: song.country,
      year: song.year?.toString(),
      rating: song.rating?.toString()
    }, { emitEvent: true });

    if (typeof song.year === 'number') {
      this.yearNumberControl.setValue(song.year, { emitEvent: false });
    }

    if (song.companies && song.companies.length > 0) {
      while (this.companiesArray.length) {
        this.companiesArray.removeAt(0);
      }

      song.companies.forEach(company => {
        this.companiesArray.push(this.fb.control(company));
      });

      this.companies.set(song.companies);
    }
  }

  addCompany(company: string) {
    if (company.trim()) {
      this.companiesArray.push(this.fb.control(company.trim()));
      this.companies.update(current => [...current, company.trim()]);
      return true;
    }
    return false;
  }

  removeCompany(index: number) {
    this.companiesArray.removeAt(index);
    this.companies.update(current => current.filter((_, i) => i !== index));
  }

  removeLastGenre() {
    const currentGenres = this.form.get('genre')?.value as string[];
    if (currentGenres?.length > 0) {
      this.form.patchValue({
        genre: currentGenres.slice(0, -1)
      });
    }
  }

  onYearSelected(year: number) {
    this.yearNumberControl.setValue(year);
    this.form.patchValue({ year: year.toString() });
  }

  onCountrySelected(country: string) {
    this.form.patchValue({ country });
  }

  clearCountry() {
    this.form.patchValue({ country: '' });
    this.countryFilterCtrl.setValue('');
  }

  getValue(): Partial<Song> {
    const formValue = this.form.value;
    return {
      ...formValue,
      id: formValue.id ? Number(formValue.id) : undefined,
      year: formValue.year ? Number(formValue.year) : undefined,
      rating: formValue.rating ? Number(formValue.rating) : undefined,
      duration: formValue.duration ? Number(formValue.duration) : undefined
    } as Partial<Song>;
  }
}
