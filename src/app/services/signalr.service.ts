import { Inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr'
import { SIGNALR_URL } from '../app-injection-tokens';
import { Message } from '../models/Message';
import { ACCES_TOKEN_KEY } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private signalrConnect: signalR.HubConnection =
  new signalR.HubConnectionBuilder()
    .withUrl(
      this.signalrUri + 'Chat',{
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

  EventsOn(){
    this.signalrConnect.on("ReceiveMessage",(data:Message) => this.ReceiveMessage(data));
  }

  ReceiveMessage(data:Message){
    console.log(data);  
  }

  EventsOff(){
    this.signalrConnect.off("ReceiveMessage");
  }
}
