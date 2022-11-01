import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessengerStateService } from 'src/app/services/messenger-state.service';

@Component({
  selector: 'app-contacts-search',
  templateUrl: './contacts-search.component.html',
  styleUrls: ['./contacts-search.component.scss']
})
export class ContactsSearchComponent implements OnInit {
  public contactSearchForm!:FormGroup;

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

  Submit(){
    this.messengerState.emitContactSearchEvent(this.contactSearchForm.value);
    this.router.navigate(['/contactsearchresult']);
  }
}
