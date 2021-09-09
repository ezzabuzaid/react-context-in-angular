import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ColorAvatarComponent } from './components/chat-avatar';
import { ChatContainerComponent } from './components/chat-container';
import { ChatMessageComponent, TestChild } from './components/chat-message';
import { ConsumerComponent } from './context/context-consumer.component';
import { ProviderComponent } from './context/context-provider.component';
import { ContextComponent } from './context/context.component';


@NgModule({
  declarations: [
    AppComponent,
    ConsumerComponent,
    ProviderComponent,
    ContextComponent,
    ChatMessageComponent,
    ColorAvatarComponent,
    ChatContainerComponent,
    TestChild,
  ],
  imports: [
    BrowserModule,
    // RouterModule.forRoot([{
    //   path: '',
    //   component: ChatContainerComponent
    // }])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
