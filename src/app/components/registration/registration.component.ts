import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { BackendService } from 'src/app/services/backend.service';
import { ValidateService } from 'src/app/services/validate.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  public registrationForm!:FormGroup;
  public error?:string;

  constructor(
    private validateService:ValidateService,
    private backend:BackendService
  ) { }

  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      name: new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required]),
      passwordConfirm: new FormControl('',[Validators.required])
    },
    this.validateService.passwordMatch('password', 'passwordConfirm')
    );
  }

  onSubmit(){
    if (this.registrationForm.invalid){
      return;
    }
    var sub = this.backend.post('user',{name:this.registrationForm.value.name,password:this.registrationForm.value.name}).subscribe({
      next: (user) => {console.log(user); this.error = undefined;},
      error: (error) => this.error = error.error
    })
  }
  
}
