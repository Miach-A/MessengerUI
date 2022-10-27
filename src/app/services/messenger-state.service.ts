import { Injectable } from '@angular/core';
import { Chat } from '../models/Chat';
import { ChatEvent } from '../models/ChatEvent';
import { Message } from '../models/Message';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class MessengerStateService {
  private _user?:User;
  private _chat?:Chat;
  private _event:ChatEvent = ChatEvent.New;
  private _targetMessage?:Message;
  private _targetChat?:Chat;
  constructor() { }

  public SetUser(user:User){
    this._user = user; 
    this._chat = undefined;
    this._event = ChatEvent.New;
    this._targetMessage = undefined;
  }

  public GetUser():User|undefined{
    return this._user;
  }

  public SetChat(chat:Chat){
    this._chat = chat;
    this._event = ChatEvent.New;
    this._targetMessage = undefined;
    this._targetChat = undefined;
  }

  public SetTargetChat(chat:Chat,message:Message){
    this._targetChat = chat;
    this._event = ChatEvent.Comment;
    this._targetMessage = message;
  }

  public GetChat():Chat|undefined{
    return this._targetChat === undefined ? this._chat : this._targetChat;
  }

  public BeginComment(message:Message){
    this._event = ChatEvent.Comment;
    this._targetMessage = message;
  }

  public BeginEdit(message:Message){
    this._event = ChatEvent.Edit;
    this._targetMessage = message;
  }

}
