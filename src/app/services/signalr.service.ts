import { Inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr'
import { SIGNALR_URL } from '../app-injection-tokens';
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
}
