import { Component } from '@angular/core';

@Component({
    selector: 'app-chat-container',
    template: `
    <div style="display: flex;">
        <provider name="MyContext" [value]="{message:'Test', avatar:'asa'}">
            <app-chat-avatar></app-chat-avatar>
        </provider>
        <app-chat-message></app-chat-message> 
        <provider name="MyContext" [value]="{message:'Test'}">
            <app-chat-message></app-chat-message>
        </provider>
    </div>
    `
})
export class ChatContainerComponent { }
