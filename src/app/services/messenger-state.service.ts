import { Injectable } from '@angular/core';
import { Chat } from '../models/Chat';
import { ChatEvent } from '../models/ChatEvent';
import { Contact } from '../models/Contact';
import { CreateMessageDTO } from '../models/CreateMessageDTO';
import { Message } from '../models/Message';
import { UpdateMessageDTO } from '../models/UpdateMessageDTO';
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
    console.log("user");
    console.log(this._user);
    console.log("----");
    this._user = user; 
    this._chat = undefined;
    this._event = ChatEvent.New;
    this._targetMessage = undefined;
    this._targetChat = undefined;
  }

  public GetUser():User|undefined{
    return this._user;
  }

  public SetChat(contact:Contact):void;
  public SetChat(chat:Chat):void;
  public SetChat(arg:Chat|Contact){
    //console.log(this._user);
    console.log(this._user?.chats);
    console.log("1");
    console.log(this._user?.chats.find(x => x.users.length == 2));
    console.log("2");
    //var dd = (arg as Contact);
    //console.log(dd);
 
    //console.log(this._user?.chats.find(x => x.users.includes((arg as Contact))));
    console.log(this._user?.chats.find(x => x.users.findIndex(y => y.name === arg.name) !== -1));
    if (arg instanceof Chat){
      this._chat = arg;
    }
    else{
      this._chat = this._user?.chats.find(x => x.users.length == 2 && x.users.includes((arg as Contact)));
    }
    this._event = ChatEvent.New;
    this._targetMessage = undefined;
    this._targetChat = undefined;
    //console.log(this._chat);
  }


  private GetChat():Chat|undefined{
    return this._targetChat === undefined ? this._chat : this._targetChat;
  }

  public StartComment(message:Message,targetChat?:Chat):boolean{
    if (this._event != ChatEvent.New){
      return false;
    }
    this._event = ChatEvent.Comment;
    this._targetMessage = message;
    this._targetChat = targetChat;
    return true;
  }

  public StartUpdate(message:Message):boolean{
    if (this._event != ChatEvent.New){
      return false;
    }
    this._event = ChatEvent.Update;
    this._targetMessage = message;
    return false;
  }

  public CancelChatEvent(){
    this._event != ChatEvent.New;
    this._targetChat = undefined;
    this._targetMessage = undefined;
  }

  public GetEvent():ChatEvent{
    return this._event;
  }

  public GetMessageDTO(text:string):UpdateMessageDTO|CreateMessageDTO|undefined{
    if (this.GetChat() === undefined
      || this._user === undefined) {
      return undefined;
    } 

    if (this._event === ChatEvent.Update){
      return this.GetUpdateMessageDTO(text);
    } 
    else{
      return this.GetCreateMessageDTO(text);
    }
  }

  private GetUpdateMessageDTO(text:string):UpdateMessageDTO{
    const message = new UpdateMessageDTO();
    message.chatGuid = (this.GetChat() as Chat).guid;
    message.date = (this._targetMessage as Message).date;
    message.guid = (this._targetMessage as Message).guid;
    message.text = text;
    return message;
  }

  private GetCreateMessageDTO(text:string):CreateMessageDTO{
    const message = new CreateMessageDTO();
    message.chatGuid = (this.GetChat() as Chat).guid;
    message.commentedMessageGuid = this._targetMessage?.guid;
    message.commentedMessageDate = this._targetMessage?.date;
    message.text = text;
    return message;
  }

}
