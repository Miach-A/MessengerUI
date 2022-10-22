import { Inject, Injectable } from '@angular/core';
import { User } from '../models/User';
import { HttpClient } from '@angular/common/http';
import { BACKEND_API_URL } from '../app-injection-tokens';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Token } from '../models/Token';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

export const ACCES_TOKEN_KEY = "messenger_access_token"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user:User = new User();
  constructor(private httpClient:HttpClient,
    @Inject(BACKEND_API_URL) private apiUrl:string,
    private JwtHelper:JwtHelperService,
    private router:Router) {   }

  login(name:string, password:string):Observable<Token>{
    return this.httpClient.post<Token>(`${this.apiUrl}api/Authenticate`, {name: name, password:password});
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
}
