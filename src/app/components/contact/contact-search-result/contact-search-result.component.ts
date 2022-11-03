import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
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
  private _searchForm:any;
  private _totalCount:number = 0;
  private _page:number = 0;
  private _pageSize:number = 0;
  public contacts:Contact[] = [];
/*   public length = 100;
  public pageSize = 25;
  public pageSizeOptions: number[] = [5, 25, 50, 100];
  public pageEvent: PageEvent = new PageEvent(); */
  
  constructor(
    private messengerState: MessengerStateService,
    private backendService: BackendService
  ) {
    this._subscriptions.push(
      this.messengerState.GetContactSearchEmitter()
        .pipe(
          tap((data: any) => {
            this._searchForm = data;
            this._pageSize = this._searchForm.pagesize;
            this._page = this._searchForm.pageindex;
          }),
          switchMap((data: any) => this.SearchData()) //this.backendService.get("GetUsers", undefined, data)
        ).subscribe({
          next: (data) => { this.SetData(data); }
        }));
  }

  ngOnInit(): void {

  }

  SearchData():Observable<Object>{
    return this.backendService.get("GetUsers", undefined, this._searchForm);
  }

  GetPageCount():number{
    return this._totalCount / this._pageSize + 1;
  }

  NextPage(){
    if (this._searchForm.pageindex = this.GetPageCount()){
      return;
    }

    this._searchForm.pageindex += 1; 
  }

  PreviousPage(){
    if (this._searchForm.pageindex === 0){
      return;
    }

    this._searchForm.pageindex -= 1; 
  }

  SetData(data:any){
    this._totalCount = data.totalCount;
    this.contacts = [];
    data.contacts.forEach((contact:Contact) => {
      this.contacts.push(new Contact(contact));
    });
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

}
