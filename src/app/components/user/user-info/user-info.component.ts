import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { MessengerStateService } from 'src/app/services/messenger-state.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  public user:User;
  constructor(private messengerState:MessengerStateService
  ) { 
    this.user = messengerState.GetUser();
  }

  ngOnInit(): void {
  }

}
