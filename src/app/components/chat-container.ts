import { Component } from '@angular/core';

@Component({
    selector: 'app-chat-container',
    template: `
    <div style="display: flex;">
        <app-chat-avatar></app-chat-avatar>
        <app-chat-message></app-chat-message> 
        <!-- <provider name="MyContext" [value]="{message:'Test'}">
            <app-chat-message></app-chat-message>
        </provider> -->
    </div>
    `
})
export class ChatContainerComponent { }
