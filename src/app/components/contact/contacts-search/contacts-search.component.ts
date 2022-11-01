import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-contacts-search',
  templateUrl: './contacts-search.component.html',
  styleUrls: ['./contacts-search.component.scss']
})
export class ContactsSearchComponent implements OnInit, OnDestroy {
  public contactSearchForm!:FormGroup;
  private _subscriptions:Subscription[] = [];

  constructor(
    private backendService:BackendService
  ) { }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.contactSearchForm = new FormGroup({
      name: new FormControl(),
      orderby:new FormControl(0),
      pageindex:new FormControl(0),
      pagesize:new FormControl(20),
    });
  }

  Submit(){
    this._subscriptions.push(
      this.backendService.get("GetUsers",undefined,this.contactSearchForm.value).subscribe({
        next: (data) => console.log(data)
      }));
  }
}
