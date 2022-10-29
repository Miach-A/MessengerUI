import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private trySubmit:boolean = false;
  //public username:string = "";
  //public password:string = "";
  public loginForm!:FormGroup;

  constructor(
    private authService:AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      name: new FormControl(),
      password: new FormControl()
    });
  }

  LoginValid():boolean{
    return !this.trySubmit || this.authService.IsAuthenticated();
  }

  onSubmit(){
    this.authService.LogIn(this.loginForm.value.name,this.loginForm.value.password);
    this.trySubmit = true;
  }

}
