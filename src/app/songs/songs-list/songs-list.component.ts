import { Component, inject, OnInit } from "@angular/core";
import { SongsService } from "../services/songs.service";

@Component({
  selector: 'app-song-list',
  templateUrl: './songs-list.component.html',
  styleUrl: './songs-list.component.css'
})
export class SongListComponent implements OnInit {
  songsService = inject(SongsService)


  ngOnInit(): void {
    this.getData()
  }

  async getData() {
    const data = await this.songsService.getSongs()
    console.log(data)
  }
}
