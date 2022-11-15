import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ContactSelect } from 'src/app/models/ContactSelect';
import { MessengerStateService } from 'src/app/services/messenger-state.service';


@Component({
  selector: 'app-contact-selection',
  templateUrl: './contact-selection.component.html',
  styleUrls: ['./contact-selection.component.scss']
})
export class ContactSelectionComponent implements OnInit {

  public contactSelects:Array<ContactSelect> = [];

  constructor(
    public dialogRef: MatDialogRef<ContactSelectionComponent>,
    private messengerStateService:MessengerStateService
  ) { }

  ngOnInit(): void {
    const contacts = this.messengerStateService.GetUser()?.contacts;
    if (contacts != undefined){
      contacts.forEach(contact => {
        this.contactSelects.push(new ContactSelect(contact));
      });
    }
  }

}
