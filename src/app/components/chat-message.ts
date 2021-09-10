import { Component } from '@angular/core';

@Component({
    selector: 'app-chat-message',
    template: `
    <consumer name="MyContext">
        <ng-template let-value>
            <h4>{{value.message}}</h4>
        </ng-template>
    </consumer>
    `
})
export class ChatMessageComponent { }


@Component({
    selector: 'app-test-child',
    template: `
    <consumer name="TestContext">
        <ng-template let-value>
            <h4>{{value|json}}</h4>
        </ng-template>
    </consumer>
    `
})
export class TestChild { }
