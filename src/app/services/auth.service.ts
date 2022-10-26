import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Token } from '../models/Token';
import { Observable, Subscription, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { BackendService } from './backend.service';

export const ACCES_TOKEN_KEY = "messenger_access_token"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user:User = new User();
  constructor(
    private backendService:BackendService,
    private JwtHelper:JwtHelperService,
    private router:Router) {   }

  LogIn(name:string, password:string){

    const getToken:Observable<{}> = this.backendService.post("Authenticate",{name: name, password:password})
    .pipe(
      tap({
        next: (token) => localStorage.setItem(ACCES_TOKEN_KEY, (token as Token).access_token),
        }));

      const getUserInfo:Observable<User> = getToken.pipe(
        switchMap(() => this.backendService.get("User") as Observable<User>)
      );

      getUserInfo.subscribe({
        next: (user) => this._user = new User(user),
        error : () => {
          alert("Unauthorized");
          this.Logout();}
      });

  }

  GetUserInfo(){
    (this.backendService.get("User") as Observable<User>).subscribe({
      next: (user) => this._user = new User(user),
      error : () => this.Logout()
    })
  }

  IsAuthenticated():boolean{
    var token = localStorage.getItem(ACCES_TOKEN_KEY);
    return !!token && !this.JwtHelper.isTokenExpired(token);
  }

  Logout():void{
    localStorage.removeItem(ACCES_TOKEN_KEY);
    this._user = new User();
    this.router.navigate(['']);
  }

  CurentUser():User{
    return this._user;
  }

  GetToken():string {
    var token = localStorage.getItem(ACCES_TOKEN_KEY); 
    return token === null ? "" : token;
  }
  
}
