import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { VideoInfo } from './models/video-info.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild("video-info", {static: false}) videoInfoDiv! : ElementRef<HTMLDivElement>;
  title = 'YT2MP3';

  videoId: string = '';
  titleMusic: string = '';
  artist: string = '';

  videoInfo!: VideoInfo;

  isGettingVideo : boolean = false;
  videoInfoAvailable : boolean = false;
  isConverting : boolean = false;

  constructor(private http: HttpClient) {}

  getAudioFile() {
    this.isConverting = true;
    const url = `http://192.168.1.5:5044/convert?videoId=${this.videoId}&title=${this.titleMusic}&artist=${this.artist}`;
    this.http.get(url, { responseType: 'blob' }).subscribe(
      (response) => {
        this.downloadFile(response);
        this.videoId = '';
        this.titleMusic = '';
        this.artist = '';
        this.isConverting = false;
      },
      (error) => {
        alert('Error occurred: ' + error.message);
        this.isConverting = false;
      }
    );
  }

  getVideo() {
    this.isGettingVideo = true;
    const url = `http://192.168.1.5:5044/getinfo?videoId=${this.videoId}`;
    this.http.get<VideoInfo>(url).subscribe((response) => {
      this.videoInfo = response;
      this.titleMusic = this.videoInfo.title;
      if(this.videoInfo.artist){
        this.artist = this.videoInfo.artist;
      }else{
        this.artist = "N/A";
      }
      this.isGettingVideo = false;
      this.videoInfoAvailable = true;
    },(error) => {
      alert('Error occured: ' + error.message);
      this.isGettingVideo = false;
      this.videoInfoAvailable = false;
    });
  }

  downloadFile(blob: Blob) {
    const link = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.download = `${this.titleMusic}.mp3`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
