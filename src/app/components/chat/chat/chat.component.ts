import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Chat } from 'src/app/models/Chat';
import { Message } from 'src/app/models/Message';
import { MessengerStateService } from 'src/app/services/messenger-state.service';
import { SignalrService } from 'src/app/services/signalr.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit,OnDestroy {
  private _subscriptions:Subscription[] = [];
  public text:string = "";
  public chat?:Chat;

  constructor(
    private signalrService:SignalrService,
    private activatedRoute:ActivatedRoute,
    private messengerState:MessengerStateService
  ) { }

  ngOnInit(): void {
    this._subscriptions.push(
      this.activatedRoute.paramMap.subscribe({
        next: (param) => {
          this.UpdateData(param.get('guid') ?? "");  
        }
      }));

      this._subscriptions.push(
        this.messengerState.GetUserDataChangeEmitter()
          .subscribe({ 
            next: () => {this.UpdateData(this.activatedRoute.snapshot.paramMap.get('guid') ?? ""); }
          }));
  }

  UpdateData(guid:string){
    console.log(guid);
    this.chat = this.messengerState.GetChat(guid);
    console.log(this.chat);
    if (!!this.chat){
      this.messengerState.SetChat(this.chat);
    }    
  }

  SendMessage(){
    const newMessage = this.messengerState.GetMessageDTO(this.text);
    if (newMessage == undefined){
      return;
    }

    this.signalrService.SendMessage(newMessage);
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.signalrService.EventsOff();
    this.signalrService.Disconnect();
  }
}
