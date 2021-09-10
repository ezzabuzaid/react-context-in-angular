import { Component } from '@angular/core';

@Component({
    selector: 'app-chat-message',
    template: `
    <consumer name="ChatContext">
        <ng-template let-value>
            <h4>{{value.message}}</h4>
        </ng-template>
    </consumer>
    `
})
export class ChatMessageComponent { }
