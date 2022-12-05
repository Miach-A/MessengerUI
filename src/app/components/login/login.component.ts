import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private _trySubmit:boolean = false;
  public loginForm!:FormGroup;

  constructor(
    private _authService:AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      name: new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required])
    });
  }

  LoginValid():boolean{
    return !this._trySubmit || this._authService.IsAuthenticated();
  }

  Submit(){
    if (this.loginForm.invalid) {
      return;
    }
    this._trySubmit = false;

    this._authService.LogIn(this.loginForm.value.name, this.loginForm.value.password).subscribe({
      next: (user) => this._trySubmit = true,
      error: (error) => this._trySubmit = true
    });
  }

}
