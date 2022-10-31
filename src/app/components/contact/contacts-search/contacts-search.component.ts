import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-contacts-search',
  templateUrl: './contacts-search.component.html',
  styleUrls: ['./contacts-search.component.scss']
})
export class ContactsSearchComponent implements OnInit {
  public contactSearchForm!:FormGroup;
  constructor() { }

  ngOnInit(): void {
    this.contactSearchForm = new FormGroup({
      name: new FormControl(),
      firstName: new FormControl(),
      lastName: new FormControl(),
    });
  }

  Submit(){
    //console.log(this.contactSearchForm.value);
  }

}
