import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, fromEvent, map, Observable, tap } from 'rxjs';
import { MessengerStateService } from 'src/app/services/messenger-state.service';

@Component({
  selector: 'app-contacts-search',
  templateUrl: './contacts-search.component.html',
  styleUrls: ['./contacts-search.component.scss']
})
export class ContactsSearchComponent implements OnInit, AfterViewInit {
  public contactSearchForm!:FormGroup;
  public search$:Observable<Event> = new Observable;
  @ViewChild('searchInput') searchInput!:ElementRef;

  constructor(
    private messengerState:MessengerStateService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.contactSearchForm = new FormGroup({
      name: new FormControl(),
      orderby:new FormControl(0),
      pageindex:new FormControl(0),
      pagesize:new FormControl(20),
    });
  }

  ngAfterViewInit(){
    this.search$ = fromEvent(this.searchInput.nativeElement,'input');
    this.search$.pipe(
      map(event => {
        return (event.target as HTMLInputElement).value;
      }),
      debounceTime(500),
      map(value => value.length >= 3 ? value : ''),
      distinctUntilChanged(),
      tap(() => this.router.navigate(['/contactsearchresult']))
    ).subscribe(value => {
      //console.log(value);
      this.messengerState.emitContactSearchEvent(this.contactSearchForm.value);
    });
  }

  NavigateSearchResult(){
    //this.router.navigate(['/contactsearchresult']);
  }

  Submit(){ 
   //this.messengerState.emitContactSearchEvent(this.contactSearchForm.value);
  }
}
