import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { ValidateService } from 'src/app/services/validate.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  private _subscriptions:Subscription[] = [];
  public registrationForm!:FormGroup;
  public errors?:object = undefined;

  constructor(
    private validateService:ValidateService,
    private backend:BackendService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      name: new FormControl('',[Validators.required,Validators.minLength(3),Validators.maxLength(36),Validators.pattern("^[a-zA-Z0-9]+$")]),
      password: new FormControl('',[Validators.required]),
      passwordConfirm: new FormControl('',[Validators.required])
    },
    this.validateService.passwordMatch('password', 'passwordConfirm')
    );
  }

  HasErrors():boolean{ 
    return this.errors != undefined;
  }

  GetErrors(){
    return Object.entries((this.errors as object));
  }

  Submit(){
    if (this.registrationForm.invalid){
      return;
    }
    
    this._subscriptions.push(
      this.backend.post('user',{name:this.registrationForm.value.name,password:this.registrationForm.value.name}).subscribe({
      next: (user) => {
        this.errors = undefined; 
        this.router.navigate(['/login'])},
      error: (responce) => {this.errors = responce.error.errors;} 
    }));
  }

  ngOnDestroy(){
    this._subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
  
}
