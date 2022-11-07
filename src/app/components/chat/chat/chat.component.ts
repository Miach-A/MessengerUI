import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';
import { Chat } from 'src/app/models/Chat';
import { Message } from 'src/app/models/Message';
import { BackendService } from 'src/app/services/backend.service';
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
    private messengerState:MessengerStateService,
    private backendService:BackendService
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
            next: () => {
              this.UpdateData(this.activatedRoute.snapshot.paramMap.get('guid') ?? ""); }
          }));
  }

  UpdateData(guid: string) {
    this.chat = this.messengerState.GetChat(guid);
    if (!this.chat) {
      return;
    }

    this.messengerState.SetChat(this.chat);  
    if (this.messengerState.GetMessages(guid).length < 20){
      this._subscriptions.push(
        this.GetMessagesFromBack(guid)  
      ); 
    }
  }

  GetMessages():Message[] {
    if (this.chat === undefined){
      return new Array<Message>;
    }
    return this.messengerState.GetMessages(this.chat.guid);
  }

  GetMessagesFromBack(chatGuid:string):Subscription{
    const date = this.messengerState.GetMessages(chatGuid)[0]?.date;
    var search;
    if(date === undefined){
      search =  { chatGuid: chatGuid, count: 50}
    }
    else{
      search =  { chatGuid: chatGuid, count: 50, date:date.toString()}
    }
    
    return this.backendService
    .get("Message", undefined,search)
    .pipe(
      map((data: any) => {
        const messages: Message[] = [];
        data.forEach((message: Message) => {
          messages.push(new Message(message));
        });
        return messages;
      }))
    .subscribe({
      next: (data) => this.messengerState.SetMessages(chatGuid, data)
    });
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
  }
}
