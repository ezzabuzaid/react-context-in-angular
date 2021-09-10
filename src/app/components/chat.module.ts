import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ContextModule } from '../context';
import { ColorAvatarComponent } from './chat-avatar';
import { ChatContainerComponent } from './chat-container';
import { ChatMessageComponent } from './chat-message';

@NgModule({
    declarations: [
        ChatMessageComponent,
        ColorAvatarComponent,
        ChatContainerComponent,
    ],
    exports: [
        ChatMessageComponent,
        ColorAvatarComponent,
        ChatContainerComponent,
    ],
    imports: [
        CommonModule,
        ContextModule
    ]
})
export class ChatModule { }
