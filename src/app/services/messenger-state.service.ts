import { Injectable } from '@angular/core';
import { Chat } from '../models/Chat';
import { ChatEvent } from '../models/ChatEvent';
import { Message } from '../models/Message';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class MessengerStateService {
  private _user:User = new User();
  private _chat:Chat = new Chat();
  private _event:ChatEvent = ChatEvent.New;
  private _commentedMessage:Message = new Message();
  constructor() { }
}
