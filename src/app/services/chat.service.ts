import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Chat } from '../models/Chat';
import { CreateChatDTO } from '../models/CreateChatDTO';
import { BackendService } from './backend.service';
import { MessengerStateService } from './messenger-state.service';
import { SignalrService } from './signalr.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnDestroy {
  private _subscriptions:Subscription[] = [];
  
  constructor(
    private backendService:BackendService,
    private messengerState:MessengerStateService,
    private signalrService: SignalrService,
    private route:Router
  ) { }

  CreateChat(contactName?:string[], chatName?:string, isPublic = false){

    if (chatName === undefined){
      chatName = this.messengerState.GetUser()?.name + "-" + contactName; 
    }

    this._subscriptions.push(
      this.backendService.post("PostChat",
        new CreateChatDTO(
          contactName,
          chatName,
          isPublic)).subscribe({
            next: (chat) => {
              const newChat = new Chat(chat as Chat);
              this.messengerState.UpdateChat(newChat);
              this.signalrService.SendNewChat(newChat.guid);
              this.route.navigate(['chat', newChat.guid]);
            }
          }));
  }

  GetChatName(chat:Chat):string{
    if (chat.public === true){
      return chat.name;
    }

    return chat.users.filter(x => x.name != this.messengerState.GetUser()?.name)[0].name;
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
