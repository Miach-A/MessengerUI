import { EventEmitter, Injectable } from '@angular/core';
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
  //private _contact?:Contact;
  private _chat?:Chat;
  private _event:ChatEvent = ChatEvent.New;
  private _targetMessage?:Message;
  private _targetChat?:Chat;
  private _contactSearch: EventEmitter<any> = new EventEmitter();

  constructor() { }

  public AddContact(contact:Contact){
    this._user?.contacts.push(contact);
  }

  public DeleteContact(contact:Contact){
    const index = this._user?.contacts.indexOf(contact);
    if (index === undefined){
      return;
    }

    this._user?.contacts.slice(index,1);
  }

  public emitContactSearchEvent(data:any) {
    this._contactSearch.emit(data);
  }

  public getContactSearchEmitter() {
    return this._contactSearch;
  }

  public SetUser(user?:User){
    this._user = user; 
    this._chat = undefined;
    this._event = ChatEvent.New;
    this._targetMessage = undefined;
    this._targetChat = undefined;
  }

  public GetUser():User|undefined{
    return this._user;
  }


  public GetContact(name:string):Contact | undefined{
    return this._user?.contacts.find(x => x.name === name);
  }

  public SetChat(contact:Contact):void;
  public SetChat(chat:Chat):void;
  public SetChat(arg:Chat|Contact){
    if (arg instanceof Chat){
      this._chat = arg;
    }
    else{
      this._chat = this._user?.chats.find(x => x.users.length == 2 && x.users.findIndex(y => y.name === arg.name) !== -1 );
    }
    this._event = ChatEvent.New;
    this._targetMessage = undefined;
    this._targetChat = undefined;
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
