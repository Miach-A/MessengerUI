import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { ChatInfoComponent } from './chat-info/chat-info.component';
import { ChatIconComponent } from './chat-icon/chat-icon.component';
import { RouterLink, RouterModule } from '@angular/router';
import { AngularMaterialModule } from 'src/app/modules/angular-material.module';


@NgModule({
  declarations: [
    ChatComponent,
    ChatInfoComponent,
    ChatIconComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    AngularMaterialModule
  ],
  exports:[ChatIconComponent]
})
export class ChatModule { }
