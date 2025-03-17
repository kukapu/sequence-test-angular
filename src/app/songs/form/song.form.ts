import { inject, signal } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, of } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { Song } from "../models/song.model";

interface SongFormType {
  id: FormControl<string | null>;
  title: FormControl<string | null>;
  artist: FormControl<string | null>;
  poster: FormControl<string | null>;
  genre: FormControl<string[] | null>;
  companies: FormArray<FormControl<string>>;
  country: FormControl<string | null>;
  duration: FormControl<number | null>;
  year: FormControl<string | null>;
  rating: FormControl<string | null>;
}

export class SongForm {
  private fb = inject(FormBuilder);
  private readonly countries = ['España', 'Estados Unidos', 'Reino Unido', 'Francia', 'Alemania', 'Italia', 'Japón'];
  private readonly maxYear = new Date().getFullYear();

  yearNumberControl = new FormControl<number | null>(null, [
    Validators.min(1900),
    Validators.max(this.maxYear)
  ]);
  yearDateControl = new FormControl<Date | null>(null);
  countryFilterCtrl = new FormControl<string>('');
  companies = signal<string[]>([]);
  filteredCountries!: Observable<string[]>;

  form!: FormGroup<SongFormType>;

  constructor() {
    this.initForm();
    this.initSubscriptions();
  }

  private initForm(): void {
    this.form = this.fb.group<SongFormType>({
      id: this.fb.control<string | null>(''),
      title: this.fb.control<string | null>('', [Validators.required]),
      artist: this.fb.control<string | null>('', [Validators.required]),
      poster: this.fb.control<string | null>(''),
      genre: this.fb.control<string[] | null>([], [Validators.required]),
      companies: this.fb.array([] as FormControl<string>[]),
      country: this.fb.control<string | null>(''),
      duration: this.fb.control<number | null>(0),
      year: this.fb.control<string | null>('', [
        Validators.min(1900),
        Validators.max(this.maxYear)
      ]),
      rating: this.fb.control<string | null>('', [
        Validators.required,
        Validators.min(0),
        Validators.max(10),
        Validators.pattern(/^\d*\.?\d{0,2}$/)
      ])
    });
  }

  private initSubscriptions(): void {
    // Configurar el filtro de países como un Observable
    this.filteredCountries = this.countryFilterCtrl.valueChanges.pipe(
      startWith(''),
      map(filterValue => {
        if (!filterValue) return this.countries;
        const filter = filterValue.toLowerCase();
        return this.countries.filter(country =>
          country.toLowerCase().includes(filter)
        );
      })
    );

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
    this.companies.update(current => {
      const updated = [...current];
      updated.splice(index, 1);
      return updated;
    });
  }

  removeLastGenre() {
    const genreControl = this.form.get('genre');
    if (genreControl && genreControl.value) {
      const currentGenres = [...genreControl.value];
      if (currentGenres.length > 0) {
        currentGenres.pop();
        genreControl.setValue(currentGenres);
      }
    }
  }

  onYearSelected(year: number) {
    this.yearNumberControl.setValue(year);
    this.form.get('year')?.setValue(year.toString());
  }

  clearCountry() {
    this.form.get('country')?.setValue(null);
    this.countryFilterCtrl.setValue('');
  }

  onCountrySelected(country: string) {
    this.form.get('country')?.setValue(country);
  }

  setEditMode(isEditing: boolean) {
    if (!isEditing) {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control) {
          control.disable();
        }
      });
      this.yearNumberControl.disable();
      this.yearDateControl.disable();
      this.countryFilterCtrl.disable();
    } else {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control) {
          control.enable();
        }
      });
      this.yearNumberControl.enable();
      this.yearDateControl.enable();
      this.countryFilterCtrl.enable();
    }
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
