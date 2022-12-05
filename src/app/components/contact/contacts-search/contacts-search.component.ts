import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { concatMap, debounceTime, distinctUntilChanged, fromEvent, map, Observable, Subscription, tap } from 'rxjs';
import { MessengerStateService } from 'src/app/services/messenger-state.service';

@Component({
  selector: 'app-contacts-search',
  templateUrl: './contacts-search.component.html',
  styleUrls: ['./contacts-search.component.scss']
})
export class ContactsSearchComponent implements OnInit, AfterViewInit {
  private _subscriptions: Subscription[] = [];
  public contactSearchForm!: FormGroup;
  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(
    private _messengerState: MessengerStateService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.contactSearchForm = new FormGroup({
      name: new FormControl(),
      orderby: new FormControl(0),
      pageindex: new FormControl(0),
      pagesize: new FormControl(25),
    });
  }

  ngAfterViewInit() {
    this._subscriptions.push(
      (fromEvent(this.searchInput.nativeElement, 'input') as Observable<Event>)
        .pipe(
          map(event => {
            return (event.target as HTMLInputElement).value;
          }),
          debounceTime(500),
          map(value => value.length >= 3 ? value : ''),
          distinctUntilChanged(),
        ).subscribe({
          next: (value) => {
            if (value !== '') {
              this._messengerState.EmitContactSearchEvent(this.contactSearchForm.value);
            }
          }
        })
    );
  }

  NavigateSearchResult() {
    this._router.navigate(['/contactsearchresult']);
  }
}
