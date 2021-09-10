import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ChatModule } from './components/chat.module';
import { ContextModule } from './context';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    ChatModule,
    ContextModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
