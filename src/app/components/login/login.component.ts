import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public username:string = "";
  public password:string = "";
  constructor(
    private authService:AuthService
  ) { }

  ngOnInit(): void {
  }

  LoginValid():boolean{
    return this.authService.IsAuthenticated();
  }

  onSubmit(){

  }

}
