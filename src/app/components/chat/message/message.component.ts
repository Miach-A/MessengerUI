import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/models/Message';
import { MessengerStateService } from 'src/app/services/messenger-state.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  public my:boolean = false;
  public openOptions:boolean = false;
  @Input() message!:Message;
  @HostBinding('style.flex-direction') messageFlexDirection:string = "row";
  
  constructor(
    private messengerState:MessengerStateService
  ) { }

  ngOnInit(): void {
    this.my = this.message.contactName == this.messengerState.GetUser()?.name;
    if (this.my){
      this.messageFlexDirection = "row-reverse";
    }
  }

  MessageOptions(event:Event){
    event.preventDefault();
    this.openOptions = !this.openOptions;
  }

  StartEdit(){
    this.messengerState.StartUpdate(this.message); 
  }

}
