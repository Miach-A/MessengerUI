import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { ChatInfoComponent } from './chat-info/chat-info.component';
import { ChatIconComponent } from './chat-icon/chat-icon.component';


@NgModule({
  declarations: [
    ChatComponent,
    ChatInfoComponent,
    ChatIconComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ChatModule { }
