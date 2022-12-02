import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private trySubmit:boolean = false;
  public loginForm!:FormGroup;

  constructor(
    private authService:AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      name: new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required])
    });
  }

  LoginValid():boolean{
    return !this.trySubmit || this.authService.IsAuthenticated();
  }

  Submit(){
    if (this.loginForm.invalid) {
      return;
    }
    this.trySubmit = false;

    this.authService.LogIn(this.loginForm.value.name, this.loginForm.value.password).subscribe({
      next: (user) => this.trySubmit = true,
      error: (error) => this.trySubmit = true
    });
    //this.trySubmit = true;
  }

}
