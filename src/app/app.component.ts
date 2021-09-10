import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <context name="MyContext">
    <provider [value]="chatItem" name="MyContext">
      <app-chat-container></app-chat-container>
    </provider>
  </context>
  <button (click)="changeChatItem()">Change Chat Item</button>
  `
})
export class AppComponent {

  chatItem = {
    message: 'Initial name',
    avatar: 'https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg',
  }


  changeChatItem() {
    const randomInt = Math.round(Math.random() * 10);
    this.chatItem = {
      message: (new Date().getTime() % 9e6).toString(36),
      avatar: `https://icon-library.com/images/avatar-icon-images/avatar-icon-images-${ randomInt }.jpg`,
    }
  }

}
