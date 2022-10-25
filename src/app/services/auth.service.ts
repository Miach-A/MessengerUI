import { Inject, Injectable } from '@angular/core';
import { User } from '../models/User';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Token } from '../models/Token';
import { concatMap, filter, flatMap, mergeMap, Observable, of, Subscription, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { BackendService } from './backend.service';

export const ACCES_TOKEN_KEY = "messenger_access_token"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user:User = new User();
  private subscription: Subscription[] = [];
  constructor(
    private backendService:BackendService,
    private JwtHelper:JwtHelperService,
    private router:Router) {   }

/*   login(name:string, password:string):Observable<Token>{
    return this.backendService.post("Authenticate",{name: name, password:password}) as Observable<Token>;
  } */
  login(name:string, password:string){
    var result = false;
    const getToken:Observable<{}> = this.backendService.post("Authenticate",{name: name, password:password})// ; //as Observable<Token>
    .pipe(
      tap(
       {next: (token) => {
        localStorage.setItem(ACCES_TOKEN_KEY, (token as Token).access_token);
        console.log("token");
        console.log(token);},
        error: () => alert("Unauthorized") 
      }),
      //switchMap(() => this.backendService.get("User") as Observable<User>)
      );

      const getUserInfo:Observable<User> = getToken.pipe(
        switchMap(() => this.backendService.get("User") as Observable<User>)
      );

      var loginsub = getUserInfo.subscribe({
        next: (user) => {
          //console.log("user1");
          //console.log(user);
          //Object.setPrototypeOf(user,User);
          //console.log("user2");
          //console.log(user);
          //console.log("instanceof");
          //console.log(user instanceof User);
          this._user = new User(user);// user;

          console.log("_user");
          console.log(this._user);},
        error : () => {alert("Unauthorized"); this.logout();}
      });


      
 
      /*      tap({
        next: (user) => {
          this._user = user as User; 
          console.log(this._user);
          return true;},
        error: (error) => {
          console.log("error 2");
          alert(error.message);
          return false;}
      }) */
    //); 

/*     var loginsub = source.subscribe({
      next: user => {console.log("next result"); console.log(user); this._user = user as User; },
      error: error => {console.log("error result");console.log(error);localStorage.removeItem(ACCES_TOKEN_KEY); result = false;}
    }); */

/*     var loginsub = source.subscribe({
        next: (token) => {
          localStorage.setItem(ACCES_TOKEN_KEY, token.access_token);
        },
        error: (error) => {
          alert(error.message)            
        }
      }); */

     this.subscription.push(loginsub);
     //return result;
  }

  isAuthenticated():boolean{
    var token = localStorage.getItem(ACCES_TOKEN_KEY);
    return !!token && !this.JwtHelper.isTokenExpired(token);
  }

  logout():void{
    localStorage.removeItem(ACCES_TOKEN_KEY);
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
