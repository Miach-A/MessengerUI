import { Component, Input, OnInit } from '@angular/core';
import { Chat } from 'src/app/models/Chat';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat-icon',
  templateUrl: './chat-icon.component.html',
  styleUrls: ['./chat-icon.component.scss']
})
export class ChatIconComponent implements OnInit {
  @Input()
  public chat!:Chat;
  public chanName:string = "";
  constructor(
    private _chatService:ChatService
  ) { }

  ngOnInit(): void {
    this.chanName = this._chatService.GetChatName(this.chat);
  }

}
