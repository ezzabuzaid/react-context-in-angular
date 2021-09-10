import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ContextModule } from '../context';
import { ColorAvatarComponent } from './chat-avatar';
import { ChatContainerComponent } from './chat-container';
import { ChatMessageComponent, TestChild } from './chat-message';

@NgModule({
    declarations: [
        ChatMessageComponent,
        ColorAvatarComponent,
        ChatContainerComponent,
        TestChild,
    ],
    exports: [
        ChatMessageComponent,
        ColorAvatarComponent,
        ChatContainerComponent,
        TestChild,
    ],
    imports: [
        CommonModule,
        ContextModule
    ]
})
export class ChatModule { }
