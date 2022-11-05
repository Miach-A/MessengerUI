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
  private _chat?:Chat;
  private _event:ChatEvent = ChatEvent.New;
  private _targetMessage?:Message;
  private _targetChat?:Chat;
  private _messageList:{[chatGuid:string] : Array<Message>} = {};
  private _contactSearch: EventEmitter<any> = new EventEmitter();
  private _userDataChange:EventEmitter<User> = new EventEmitter(); 

  constructor() { }

  public AddContact(contact:Contact){
    this._user?.contacts.push(contact);
  }

  public AddChat(chat:Chat){
    this._user?.chats.push(chat);
  }

  public DeleteContact(contact: Contact) {
    const index = this._user?.contacts.indexOf(contact);
    if (index === undefined) {
      return;
    }

    this._user?.contacts.splice(index, 1);
  }

  public EmitContactSearchEvent(data:any) {
    this._contactSearch.emit(data);
  }

  public GetContactSearchEmitter() {
    return this._contactSearch;
  }

  public GetUserDataChangeEmitter() {
    return this._userDataChange;
  }

  public EmitUserDataChangeEvent() {
    this._userDataChange.emit();
  }

  public SetUser(user?:User){
    this._user = user; 
    this._chat = undefined;
    this._event = ChatEvent.New;
    this._targetMessage = undefined;
    this._targetChat = undefined;
    this.EmitUserDataChangeEvent();
  }

  public GetUser():User|undefined{
    return this._user;
  }

  public GetContact(name:string):Contact | undefined{
    return this._user?.contacts.find(x => x.name === name);
  }

  public GetChat(guid:string):Chat | undefined{
    return this._user?.chats.find(x => x.guid === guid);
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

  private GetTargetChat():Chat|undefined{
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
    if (this.GetTargetChat() === undefined
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
    message.chatGuid = (this.GetTargetChat() as Chat).guid;
    message.date = (this._targetMessage as Message).date;
    message.guid = (this._targetMessage as Message).guid;
    message.text = text;
    return message;
  }

  private GetCreateMessageDTO(text:string):CreateMessageDTO{
    const message = new CreateMessageDTO();
    message.chatGuid = (this.GetTargetChat() as Chat).guid;
    message.commentedMessageGuid = this._targetMessage?.guid;
    message.commentedMessageDate = this._targetMessage?.date;
    message.text = text;
    return message;
  }

  public GetMessages(chatGuid:string){
    if (this._messageList[chatGuid] === undefined){
      return new Array<Message>;
    }

    return this._messageList[chatGuid];
  }

  public SetMessages(chatGuid:string, messages:Message[]){
    if (this._messageList[chatGuid] === undefined){
      this._messageList[chatGuid] = messages.reverse();
      return;
    }

    this._messageList[chatGuid] = Array.prototype.concat(messages.reverse(),this._messageList[chatGuid]);
  }

  public AddMessage(chatGuid:string,message:Message){
    if (this._messageList[chatGuid] === undefined){
      const newArray = new Array<Message>;
      newArray.push(message);
      this._messageList[chatGuid] = newArray;
      return;
    }

    this._messageList[chatGuid].push(message);
  }

}
