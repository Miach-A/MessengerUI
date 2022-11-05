import { Inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr'
import { SIGNALR_URL } from '../app-injection-tokens';
import { CreateMessageDTO } from '../models/CreateMessageDTO';
import { Message } from '../models/Message';
import { UpdateMessageDTO } from '../models/UpdateMessageDTO';
import { ACCES_TOKEN_KEY } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

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

  isConnected() {
    return this.signalrConnect.state === signalR.HubConnectionState.Connected;
  }

  Connect() {
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
    console.log(message);
    if (message instanceof CreateMessageDTO){
      this.signalrConnect.send('SendMessage',message);
    }
    else{
      this.signalrConnect.send('EditMessage',message);
    }  
  }

  EventsOn(){
    this.signalrConnect.on("ReceiveMessage",(data:Message) => this.ReceiveMessage(data));
    this.signalrConnect.on("EditMessage",(data:Message) => this.EditMessage(data));
  }

  ReceiveMessage(data:Message){
    console.log(data);  
  }

  EditMessage(data:Message){
    console.log(data);  
  }

  EventsOff(){
    this.signalrConnect.off("ReceiveMessage");
  }
}
