import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription, switchMap, tap } from 'rxjs';
import { Contact } from 'src/app/models/Contact';
import { BackendService } from 'src/app/services/backend.service';
import { MessengerStateService } from 'src/app/services/messenger-state.service';

@Component({
  selector: 'app-contact-search-result',
  templateUrl: './contact-search-result.component.html',
  styleUrls: ['./contact-search-result.component.scss']
})
export class ContactSearchResultComponent implements OnInit, OnDestroy {
  private _subscriptions:Subscription[] = [];
  private _searchForm:any;
  private _totalCount:number = 0;
  public contacts:Contact[] = [];
  public length = 100;
  public pageSize = 25;
  public pageSizeOptions: number[] = [5, 25, 50, 100];
  public pageEvent: PageEvent = new PageEvent();
  
  constructor(
    private messengerState: MessengerStateService,
    private backendService: BackendService
  ) {
    this._subscriptions.push(
      this.messengerState.GetContactSearchEmitter()
        .pipe(
          tap((data: any) => this._searchForm = data),
          switchMap((data: any) => this.backendService.get("GetUsers", undefined, data))
        ).subscribe({
          next: (data) => {this.SetData(data);}
        }));
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  SetData(data:any){
    this._totalCount = data.totalCount;
    this.contacts = [];
    data.contacts.forEach((contact:Contact) => {
      this.contacts.push(new Contact(contact));
    });
  }

  ngOnInit(): void {

  }
}
