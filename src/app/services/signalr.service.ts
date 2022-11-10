import { EventEmitter, Inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr'
import { SIGNALR_URL } from '../app-injection-tokens';
import { CreateMessageDTO } from '../models/CreateMessageDTO';
import { Message } from '../models/Message';
import { UpdateMessageDTO } from '../models/UpdateMessageDTO';
import { ACCES_TOKEN_KEY } from './auth.service';
import { MessengerStateService } from './messenger-state.service';
import { ChatEvent } from '../models/ChatEvent';
import { NewMessageEvent } from '../models/MessageEvent';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private _messageEvent:EventEmitter<NewMessageEvent> = new EventEmitter();
  private _messageDelteEvent:EventEmitter<UpdateMessageDTO> = new EventEmitter();
  private signalrConnect: signalR.HubConnection =
  new signalR.HubConnectionBuilder()
    .withUrl(
      this.signalrUri,{
        accessTokenFactory: () => localStorage.getItem(ACCES_TOKEN_KEY)??""
      }
    )
    .withAutomaticReconnect()
    .build();

  constructor(
    @Inject(SIGNALR_URL) private signalrUri: string
  ) { }

  public EmitMessageEvent(data:NewMessageEvent) {
    this._messageEvent.emit(data);
  }

  public GetMessageEvent() {
    return this._messageEvent;
  }

  public EmitDeleteMessageEvent(data:UpdateMessageDTO) {
    this._messageDelteEvent.emit(data);
  }

  public GetDeleteMessageEvent() {
    return this._messageDelteEvent;
  }

  isConnected() {
    return this.signalrConnect.state === signalR.HubConnectionState.Connected;
  }

  Connect() {
    //console.log(this.GetState());
    if (this.GetState() === signalR.HubConnectionState.Disconnected) {
      this.signalrConnect.start().then( resp => {
        
      });

    }
  }

  Disconnect() {
    this.signalrConnect.stop();
  }

  GetState(): signalR.HubConnectionState {
    return this.signalrConnect.state;
  }

  SendMessage(message:UpdateMessageDTO | CreateMessageDTO) {
    if (message instanceof CreateMessageDTO){
      this.signalrConnect.send('SendMessage',message);
    }
    else{
      this.signalrConnect.send('EditMessage',message);
    }  
  }

  DeleteMessage(message:UpdateMessageDTO){
    this.signalrConnect.send('DeleteMessage',message);
  }

  EventsOn(){
    this.signalrConnect.on("ReceiveMessage",(data:Message) => this.ReceiveMessageResult(new Message(data)));
    this.signalrConnect.on("EditMessage",(data:Message) => this.EditMessageResult(new Message(data)));
    this.signalrConnect.on("DeleteMessage",(data:UpdateMessageDTO) => this.DeleteMessageResult(new UpdateMessageDTO(data)));  
  }

  ReceiveMessageResult(message:Message){
    this.EmitMessageEvent(new NewMessageEvent(message,ChatEvent.New) );
  }

  EditMessageResult(message:Message){
    this.EmitMessageEvent(new NewMessageEvent(message,ChatEvent.Update));
  }

  DeleteMessageResult(message:UpdateMessageDTO){
    this.EmitDeleteMessageEvent(message);
  }


  EventsOff(){
    this.signalrConnect.off("ReceiveMessage");
    this.signalrConnect.off("EditMessage");
    this.signalrConnect.off("DeleteMessage");
  }
}
