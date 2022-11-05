import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/models/Message';
import { MessengerStateService } from 'src/app/services/messenger-state.service';
import { SignalrService } from 'src/app/services/signalr.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  public text:string = "";

  constructor(
    private signalrService:SignalrService,
    private messengerStateService:MessengerStateService
  ) { }

  ngOnInit(): void {
  }

  SendMessage(){
    const newMessage = this.messengerStateService.GetMessageDTO(this.text);
    if (newMessage == undefined){
      return;
    }
    
    this.signalrService.SendMessage(newMessage);
  }
}
