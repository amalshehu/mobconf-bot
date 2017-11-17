import { Component, OnInit } from '@angular/core';
import { SpeechService, Message } from './speech/speech.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private speechService: SpeechService) {

  }
  ngOnInit() {
    console.log('Test speech service...');
    this.speechService.talkWithBot();
  }
}
