# MobconfBot


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Instructions
### Create new angular project
```
ng new mobconf-bot
```
### Install dialogflow 
```
npm i api-ai-javascript -D --save
```

### Include dialog flow lib for bundling in tsconfig.app
```
  "include": [ "../node_modules/api-ai-javascript/**/*.ts", "**/*.ts" ],

``` 
### Create speech component
```
ng generate component speech
```
### Create speech service
```
ng generate service speech/speech -m app
```
### Import FormsModule in app.module.ts
```
@NgModule({
  declarations: [
    AppComponent,
    SpeechComponent,
    FormsModule
  ],
  imports: [
    BrowserModule
  ],
  providers: [SpeechService],
  bootstrap: [AppComponent]
})
```
### Declare speech component in app.component.html
Clear the default cli code first.
```
<div style="text-align:center">
  <h1>
    MobConf BOT
  </h1>
    <app-speech></app-speech>
</div>
```
### Get client access token from dialogflow and add in environment.ts
```
export const environment = {
  production: false,
  dialogflow: {
    mobconfBot: 'YOUR-API-KEY'
  }
};
```

### Configure speech service
- Import ApiAiClient 
```
import { ApiAiClient } from 'api-ai-javascript';

```

- Import the dialogflow api key from environment
```
import { environment } from '../../environments/environment';

```
### Initialize dialogflow client
- Create readonly variables for token and create ApiAiClient instance
```
readonly key = environment.dialogflow.mobconfBot;
readonly botClient = new ApiAiClient({accessToken: this.key});
```
### Let's test the dialogflow api
- In our service 
```
talkWithBot() {
    this.botClient.textRequest('Test').then(res => console.log('Test response: Its working... ', res));
  }
```
- Use dependency injection in app.component to get the service instance.
```
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
```
### Use rxJs
- Import Observable and BehaviourSubject

```
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
```
### Create a message class
```
export class Message {
  constructor(public payload: string, public sender: string) {}
}
```
### Declare conversation property in SpeechService as behavior subject
```
conversation = new BehaviorSubject<Message[]>([]);
```
### Create sync method to update our chat feed
```
sync(message: Message) {
    this.conversation.next([message]);
  }
```
### Create connectBot method to send & recieve data from Dialogflow
```
connectBot(userInput: string) {
    const userMessage = new Message(userInput, 'user');
    this.sync(userMessage);
    this.botClient.textRequest(userInput).then(res => {
      const speech = res.result.fulfillment.speech;
      const botMessage = new Message(speech, 'bot');
      this.sync(botMessage);

    });
  }
```
So we completed our speech service.

### Refactor speech.component
- Import speech service, Observable and scan operator
```
import { SpeechService, Message } from './speech.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/scan';
```
- Declare messages$ varriable in SpeechComponent and userInput variable
```
messages$: Observable<Message[]>;
userInput: string;
```
- Inject SpeechService in constructor (Dependency Injection)
```
constructor(private speechService: SpeechService) {

  }
```
### Get conversation feed on component init.
```
 this.messages$ = this.speechService.conversation.asObservable()
    .scan((accumulator, value) => accumulator.concat(value) );
```
### Create method for user to send message
```
 pushMessage() {
    this.speechService.connectBot(this.userInput);
    this.userInput = '';
  }
```
### Refactor our speech template
```
<ng-container *ngFor="let message of messages$ | async">
  <div>
    {{message.payload}}
  </div>
</ng-container>
<input  [(ngModel)]='userInput' type='text' (keyup.enter)="pushMessage()">
<button  (click)="pushMessage()">send</button>

```
### Let's add some style
- Import milligram css in your index.html
```
<link rel="stylesheet" href="//cdn.rawgit.com/necolas/normalize.css/master/normalize.css">
<link rel="stylesheet" href="//cdn.rawgit.com/milligram/milligram/master/dist/milligram.min.css">
``` 
- Reformat speech template with ngClass 
```
<ng-container *ngFor="let message of messages$ | async">
  <div class="chatbox" [ngClass]="{'bot':message.sender === 'bot',
                                  'user':message.sender === 'user'}">
    {{message.payload}}
  </div>
</ng-container>
<input class="inputBox" [(ngModel)]='userInput' type='text' (keyup.enter)="pushMessage()">
<button class="button-send" (click)="pushMessage()">send</button>


```
- Add styles in speech.component.css
```

.chatbox {
  border-radius: 50px;
  margin: 0 350px 10px;
  padding: 15px 20px;
  position: relative;
  font-weight: bold;
  width: 50%;
}
.chatbox.user {
  background-color: rgba(0, 0, 0, 0.692);
  color: #fff;
  order: 1;
  border-bottom-right-radius: 0px;
  box-shadow: 1px 2px 0px #D4D4D4;
}
.chatbox.bot {
  background-color: greenyellow;
  color: #363636;
  order: 1;
  border-top-left-radius: 0px;
  box-shadow: -1px 2px 0px #D4D4D4;
}
.chatbox.user + .chatbox.user,
.chatbox.bot + .chatbox.bot {
margin-top: -10px;
}
.inputBox{
  width:40%;
  box-shadow: 1px 2px 0px #D4D4D4;
}
.button-send {
  background-color: blueviolet;
  color: white;
  order: 1;
  border-bottom-right-radius: 0px;
  box-shadow: 1px 2px 0px #D4D4D4;
}

```
