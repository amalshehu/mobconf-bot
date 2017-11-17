import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SpeechComponent } from './speech/speech.component';
import { SpeechService } from './speech.service';

@NgModule({
  declarations: [
    AppComponent,
    SpeechComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [SpeechService],
  bootstrap: [AppComponent]
})
export class AppModule { }
