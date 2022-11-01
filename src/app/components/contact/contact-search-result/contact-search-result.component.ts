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
  ) { 
    this._subscriptions.push(
      this.messengerState.getContactSearchEmitter().subscribe({
        next: (data:any) => this.ContactSearchChange(data)
      })
    );
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  ngOnInit(): void {

  }

  ContactSearchChange(data:any){
    this._subscriptions.push(
      this.backendService.get("GetUsers", undefined, data).subscribe({
        next: (data) => { console.log(data); }
      }));
  }

}
