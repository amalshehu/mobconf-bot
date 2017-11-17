import { Injectable } from '@angular/core';
import { ApiAiClient } from 'api-ai-javascript';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../environments/environment';

export class Message {
  constructor(public payload: string, public sender: string) {}
}

@Injectable()
export class SpeechService {
  readonly key = environment.dialogflow.mobconfBot;
  readonly botClient = new ApiAiClient({accessToken: this.key});
  conversation = new BehaviorSubject<Message[]>([]);
  constructor() { }
  talkWithBot() {
    this.botClient.textRequest('Test').then(res => console.log('Test successful', res));
  }
  sync(message: Message) {
    this.conversation.next([message]);
  }
  connectBot(userInput: string) {
    const userMessage = new Message(userInput, 'user');
    this.sync(userMessage);
    this.botClient.textRequest(userInput).then(res => {
      const speech = res.result.fulfillment.speech;
      const botMessage = new Message(speech, 'bot');
      this.sync(botMessage);

    });
  }
}
