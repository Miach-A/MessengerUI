import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Token } from '../models/Token';
import { map, Observable, Subscription, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { BackendService } from './backend.service';
import { MessengerStateService } from './messenger-state.service';
import { SignalrService } from './signalr.service';

export const ACCES_TOKEN_KEY = "messenger_access_token"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user:User = new User();
  constructor(
    private messengerState:MessengerStateService,
    private backendService:BackendService,
    private signalrService:SignalrService,
    private JwtHelper:JwtHelperService,
    private router:Router) {   }

  LogIn(name:string, password:string):Observable<User>{

    const getToken:Observable<Object> = this.backendService.post("Authenticate",{name: name, password:password})
    .pipe(
      tap({
        next: (token) => {
          localStorage.setItem(ACCES_TOKEN_KEY, (token as Token).access_token);
          this.signalrService.Connect();
        }
        }));

      const getUserInfo:Observable<User> = getToken.pipe(
        switchMap(() => this.backendService.get("User") as Observable<User>)
      );

/*       getUserInfo.subscribe({
        next: (user) => {
          this.messengerState.SetUser(new User(user)); 
          this.router.navigate(['/'])
          },
        error : () => {
          //alert("Unauthorized");
          //this.Logout();
        }
      }); */

      return getUserInfo.pipe(
        tap({
          next: (user) => {
            this.messengerState.SetUser(new User(user)); 
            this.router.navigate(['/']) 
          }
        })        
        );     
    
  }

  GetUserInfo():Observable<User>{
    return (this.backendService.get("User") as Observable<User>)
    .pipe(
      tap(user => this.messengerState.SetUser(new User(user)))
      );    
  }

  IsAuthenticated():boolean{
    var token = localStorage.getItem(ACCES_TOKEN_KEY);
    return !!token && !this.JwtHelper.isTokenExpired(token);
  }

  Logout():void{
    localStorage.removeItem(ACCES_TOKEN_KEY);
    this.messengerState.SetUser(undefined);
    this.signalrService.Disconnect();
    this.router.navigate(['/']);
  }

  GetToken():string {
    var token = localStorage.getItem(ACCES_TOKEN_KEY); 
    return token === null ? "" : token;
  }
  
}
