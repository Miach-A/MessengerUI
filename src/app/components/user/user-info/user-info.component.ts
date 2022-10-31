import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { BackendService } from 'src/app/services/backend.service';
import { MessengerStateService } from 'src/app/services/messenger-state.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  public user?:User;
  public userForm!:FormGroup;
  private _subscriptions:Subscription[] = [];

  constructor(
    private messengerState:MessengerStateService,
    private authService:AuthService,
    private back:BackendService,
  ) { 
    this.user = messengerState.GetUser();
  }

  ngOnInit(): void {
    if (this.user === undefined) {
      this._subscriptions.push(
        this.authService.GetUserInfo().subscribe({
        next: () => {this.user = this.messengerState.GetUser();}
      }));   
    }
    
    this.userForm = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      phoneNumber:new FormControl('',[Validators.pattern('^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$')])
    });
  }

  public Submit(){

  }

  ngOnDestroy(){
    this._subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

}
