import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-chat-avatar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <consumer name="MyContext">
        <ng-template let-value>
            <img width="50" [src]="value.avatar">
        </ng-template>
    </consumer>
    `
})
export class ColorAvatarComponent { }
