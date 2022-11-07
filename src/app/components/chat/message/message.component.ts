import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/models/Message';
import { MessengerStateService } from 'src/app/services/messenger-state.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  @Input() message!:Message;
  public my:boolean = false;
  constructor(
    private messengerState:MessengerStateService
  ) { }

  ngOnInit(): void {
    this.my = this.message.contactName == this.messengerState.GetUser()?.name;
  }

}
