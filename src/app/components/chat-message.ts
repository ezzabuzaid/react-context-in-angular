import { Component } from '@angular/core';

@Component({
    selector: 'app-chat-message',
    template: `
    <consumer name="MyContext">
        <ng-template let-value>
            <h4>{{value.name}}</h4>
        </ng-template>
    </consumer>
    `
})
export class ChatMessageComponent { }
