import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  public registrationForm!:FormGroup;
 
  constructor(
  ) { }

  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      name: new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required]),
      passwordConfirmation: new FormControl('',[Validators.required])
    },
    //{validators:[this.MastMatch('password','passwordConfirmation')]}
    
/*     {
      validators:this.MastMatch('password','passwordConfirmation')
    } */
    );
  }
  
  MastMatch(value1:string,value2:string){
    return function(formGroup:FormGroup){
      const control = formGroup.controls[value1];
      const controlConfirm = formGroup.controls[value2];
      if (control.value != controlConfirm.value){
        controlConfirm.setErrors({MastMatch:true});
        //{MastMatch:true};
      }
      else{
        controlConfirm.setErrors(null);
        //return null;
      }
    }
  }

}
