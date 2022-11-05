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
      if (passwordControl.value !== confirmPasswordControl.value) {
        return { passwordMismatch: true };
      } else {
        return null;
      }
    };
  }
}
