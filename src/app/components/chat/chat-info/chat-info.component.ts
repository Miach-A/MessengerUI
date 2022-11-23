import { Component, Input, OnInit } from '@angular/core';
import { Chat } from 'src/app/models/Chat';
import { MessengerStateService } from 'src/app/services/messenger-state.service';

@Component({
  selector: 'app-chat-info',
  templateUrl: './chat-info.component.html',
  styleUrls: ['./chat-info.component.scss']
})
export class ChatInfoComponent implements OnInit {
  
  @Input()
  chat:Chat|undefined;

  constructor(private messengerState:MessengerStateService) { }

  ngOnInit(): void {
  }

  public AddMembers(){
    this.messengerState.SelectContacts();   
  }
}
