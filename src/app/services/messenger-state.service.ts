import { EventEmitter, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ContactSelectionComponent } from '../components/utilities/contact-selection/contact-selection.component';
import { Chat } from '../models/Chat';
import { ChatEvent } from '../models/ChatEvent';
import { Contact } from '../models/Contact';
import { CreateMessageDTO } from '../models/CreateMessageDTO';
import { Message } from '../models/Message';
import { NewMessageEvent } from '../models/MessageEvent';
import { UpdateMessageDTO } from '../models/UpdateMessageDTO';
import { User } from '../models/User';
import { SignalrService } from './signalr.service';

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
  private _chatEventChange:EventEmitter<ChatEvent> = new EventEmitter();
  private _chatDataChange:EventEmitter<Chat> = new EventEmitter();

  constructor(
    private signalrService:SignalrService,
    private selectContactsDialog: MatDialog
  ) {
    this.signalrService.GetMessageEvent().subscribe({
      next: (data:NewMessageEvent) => this.NewMessageHendler(data)
    });

    this.signalrService.GetDeleteMessageEvent().subscribe({
      next: (data:UpdateMessageDTO) => this.DeleteMessageHendler(data)
    });

    this.signalrService.GetNewChatEvent().subscribe({
      next: (chat:Chat) => this.UpdateChat(new Chat(chat))
    });
  }

  SelectContacts(): Observable<Contact[]> {
    const dialogRef = this.selectContactsDialog.open(ContactSelectionComponent, {
      height: '400px',
    });
    return dialogRef.afterClosed();
  }

  private NewMessageHendler(data:NewMessageEvent){
    const event = data.GetEvent();
    const message = data.GetMessage();

    if(event === ChatEvent.New || event === ChatEvent.Comment){
      this.AddMessage(message.chatGuid,message);
    }
    else if(event === ChatEvent.Update){
      this.UpdateMessage(message.chatGuid,message);
    }
  }

  private DeleteMessageHendler(data:UpdateMessageDTO){
    if (this._messageList[data.chatGuid] === undefined){
      return;
    }

    const deletemessage = this._messageList[data.chatGuid].find(x => x.guid === data.guid);
    if (deletemessage != undefined){
      this._messageList[data.chatGuid] = this._messageList[data.chatGuid].slice(this._messageList[data.chatGuid].indexOf(deletemessage),1);
    }
  }

  public AddContact(contact:Contact){
    this._user?.contacts.push(contact);
  }

  public UpdateChat(chat: Chat) {
    const existingChatIndex = this._user?.chats.findIndex(x => x.guid === chat.guid);
    if (existingChatIndex) {
      this._user!.chats[existingChatIndex] = chat;
      this.EmitChatDataChangeEvent(chat);
      return;
    }

    this._user?.chats.push(chat);
    this.signalrService.RegistrationInNewChat(chat.guid);
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
  
  public GetChatDataChangeEmitter() {
    return this._chatDataChange;
  }

  public EmitChatDataChangeEvent(chat:Chat) {
    this._chatDataChange.emit(chat);
  }

  public GetUserDataChangeEmitter() {
    return this._userDataChange;
  }

  public EmitUserDataChangeEvent() {
    this._userDataChange.emit();
  }

  public GetChatEventEmitter() {
    return this._chatEventChange;
  }

  public EmitChatEventChange() {
    this._chatEventChange.emit(this._event);
  }

  public GetTargetMessage():Message|undefined{
    return this._targetMessage;
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

  public StartComment(message:Message,targetChat?:Chat){
/*     if (this._event != ChatEvent.New){
      return false;
    } */
    this._event = ChatEvent.Comment;
    this._targetMessage = message;
    this._targetChat = targetChat;
    this.EmitChatEventChange();
    //return true;
  }

  public StartUpdate(message:Message){
/*     if (this._event != ChatEvent.New){
      return false;
    } */
    this._event = ChatEvent.Update;
    this._targetMessage = message;
    this.EmitChatEventChange();
    //return false;
  }

  public CancelChatEvent(){
    this._event = ChatEvent.New;
    this._targetChat = undefined;
    this._targetMessage = undefined;
    this.EmitChatEventChange();
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

  public UpdateMessage(chatGuid:string,message:Message){
    if (this._messageList[chatGuid] === undefined){
      const newArray = new Array<Message>;
      newArray.push(message);
      this._messageList[chatGuid] = newArray;
      return;
    }

    const editmessage = this._messageList[chatGuid].find(x => x.guid === message.guid);
    if (editmessage != undefined){
      editmessage.text = message.text;
    }
  }

  public SendMessage(text:string){
    const newMessage = this.GetMessageDTO(text);
    if (newMessage == undefined){
      return;
    }

    this.CancelChatEvent();
    this.signalrService.SendMessage(newMessage);
  }

  public DeleteMessage(message:Message){
    this.signalrService.DeleteMessage(new UpdateMessageDTO(message));
  }

  public DeleteMessageForMe(message:Message){
    this.signalrService.DeleteMessageForMe(new UpdateMessageDTO(message));
  }

}
