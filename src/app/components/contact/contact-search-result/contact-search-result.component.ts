import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, switchMap, tap } from 'rxjs';
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
  public _searchForm:any;
  private _totalCount:number = 0;
  public contacts:Contact[] = [];
  public page:number = 0;
  public pageCount:number = 0;
  
  constructor(
    private messengerState: MessengerStateService,
    private backendService: BackendService
  ) {
    this._subscriptions.push(
      this.messengerState.GetContactSearchEmitter()
        .pipe(
          tap((data: any) => {
            this._searchForm = data;
          }),
          switchMap(() => this.SearchData())
        ).subscribe({
          next: (data) => {this.SetData(data); }
        }));
  }

  ngOnInit(): void {

  }

  SearchData():Observable<Object>{
    return this.backendService.get("GetUsers", undefined, this._searchForm);
  }

  SetPageCount(){
    if (this._searchForm === undefined){
      this.pageCount = 0;
    }

    this.pageCount = Math.floor(this._totalCount / this._searchForm.pagesize)  + 1;
  }

  NextPage(){
    if (this._searchForm.pageindex + 1 === this.pageCount){
      return;
    }

    this._searchForm.pageindex += 1;
    this.GetData();
  }

  PreviousPage(){
    if (this._searchForm.pageindex === 0){
      return;
    }

    this._searchForm.pageindex -= 1; 
    this.GetData();
  }

  GetData(){
    this._subscriptions.push(
      this.SearchData().subscribe({
        next: (data) => {this.SetData(data); }
      }));
  }

  SetData(data:any){
    this._totalCount = data.totalCount;
    this.contacts = [];
    data.contacts.forEach((contact:Contact) => {
      this.contacts.push(new Contact(contact));
    });
    this.SetPageCount();
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

}
