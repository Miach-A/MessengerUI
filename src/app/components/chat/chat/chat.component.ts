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
    private messengerStateService:MessengerStateService
  ) { }

  ngOnInit(): void {
    this._subscriptions.push(
      this.activatedRoute.paramMap.subscribe({
        next: (param) => {
          this.UpdateData(param.get('guid') ?? "");
        }
      }));
  }

  UpdateData(guid:string){
    this.chat = this.messengerStateService.GetChat(guid);
    //this.messengerStateService.SetChat()
  }

  SendMessage(){
    const newMessage = this.messengerStateService.GetMessageDTO(this.text);
    console.log(newMessage);
    if (newMessage == undefined){
      return;
    }

    this.signalrService.SendMessage(newMessage);
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
