import { Component, OnInit } from '@angular/core';
import { SpeechService, Message } from './speech.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/scan';

@Component({
  selector: 'speech',
  templateUrl: './speech.component.html',
  styleUrls: ['./speech.component.css']
})
export class SpeechComponent implements OnInit {

  messages$: Observable<Message[]>;
  userInput: string;
  constructor(private speechService: SpeechService) {

  }
  ngOnInit() {
    this.messages$ = this.speechService.conversation.asObservable()
    .scan((accumulator, value) => accumulator.concat(value) );
  }
  pushMessage() {
    this.speechService.connectBot(this.userInput);
    this.userInput = '';
  }
}
