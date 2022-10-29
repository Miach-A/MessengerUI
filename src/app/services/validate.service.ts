import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor() { }

  passwordMatch(password: string, confirmPassword: string) {
    return (formGroup: AbstractControl) => {
      const passwordControl = (formGroup as FormGroup).controls[password];
      const confirmPasswordControl = (formGroup as FormGroup).controls[confirmPassword];

/*       if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors['passwordMismatch']
      ) {
        return null;
      } */

      if (passwordControl.value !== confirmPasswordControl.value) {
        //confirmPasswordControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        //confirmPasswordControl.setErrors(null);
        return null;
      }
    };
  }
}
