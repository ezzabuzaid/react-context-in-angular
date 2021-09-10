import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <context name="ChatContext">
    <provider [value]="chatItem" name="ChatContext">
      <app-chat-container></app-chat-container>
    </provider>
  </context>
  <button (click)="updateChatItem()">Change Chat Item</button>
  `
})
export class AppComponent {
  chatItem = {
    message: 'Initial name',
    avatar: 'https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg',
  }

  updateChatItem() {
    const randomInt = Math.round(Math.random() * 10);
    this.chatItem = {
      message: `Random ${ randomInt }`,
      avatar: `https://icon-library.com/images/avatar-icon-images/avatar-icon-images-${ randomInt }.jpg`,
    }
  }

}
