import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { MessengerStateService } from 'src/app/services/messenger-state.service';

@Component({
  selector: 'app-contact-search-result',
  templateUrl: './contact-search-result.component.html',
  styleUrls: ['./contact-search-result.component.scss']
})
export class ContactSearchResultComponent implements OnInit, OnDestroy {
  private _subscriptions:Subscription[] = [];
  
  constructor(
    private messengerState:MessengerStateService,
    private backendService:BackendService
  ) { }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  ngOnInit(): void {
    this._subscriptions.push(
      this.backendService.get("GetUsers",undefined,this.messengerState.GetData()).subscribe({
        next: (data) => {console.log(data);}
      })); 
  }
}
