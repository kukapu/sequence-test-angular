import { inject } from "@angular/core";
import { FormBuilder } from "@angular/forms";

export class SongForm {
  fb = inject(FormBuilder);

  constructor() {
    this.createForm();
  }  
        
  private createForm() { 
    this.fb.group({
      title: [''],
      poster: [''],
      genre: [''],
      year: [''],
      duration: [''],
      rating: [''],
      artist: ['']
    });
  } 

}
