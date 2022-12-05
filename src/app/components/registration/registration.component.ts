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
  private _subscriptions: Subscription[] = [];
  public registrationForm!: FormGroup;
  public hasErrors: boolean = false;
  public errors: any;

  constructor(
    private _validateService: ValidateService,
    private _backendService: BackendService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(18), Validators.pattern("^[a-zA-Z0-9]+$")]),
      password: new FormControl('', [Validators.required]),
      passwordConfirm: new FormControl('', [Validators.required])
    },
      this._validateService.passwordMatch('password', 'passwordConfirm')
    );
  }

  Submit() {
    if (this.registrationForm.invalid) {
      return;
    }

    this._subscriptions.push(
      this._backendService.post('user', { name: this.registrationForm.value.name, password: this.registrationForm.value.name }).subscribe({
        next: (user) => {
          this.errors = undefined;
          this.hasErrors = false;
          this._router.navigate(['/login'])
        },
        error: (responce) => { this.errors = Object.entries((responce.error.errors as object)); this.hasErrors = true; }
      }));
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

}
