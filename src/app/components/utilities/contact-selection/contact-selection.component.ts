import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Contact } from 'src/app/models/Contact';
import { ContactSelect } from 'src/app/models/ContactSelect';
import { MessengerStateService } from 'src/app/services/messenger-state.service';


@Component({
  selector: 'app-contact-selection',
  templateUrl: './contact-selection.component.html',
  styleUrls: ['./contact-selection.component.scss']
})
export class ContactSelectionComponent implements OnInit {
  //public contacts:Contact[] = [];
  public contactSelects:Array<ContactSelect> = [];
  
  constructor(
    public dialogRef: MatDialogRef<ContactSelectionComponent>,
    private messengerStateService:MessengerStateService,
    @Inject(MAT_DIALOG_DATA) public contacts: Contact[],
  ) { }

  ngOnInit(): void {
    const contacts = this.messengerStateService.GetUser()?.contacts;
    if (contacts != undefined){
      contacts.forEach(contact => {
        this.contactSelects.push(new ContactSelect(contact));
      });
    }
  }

  Switch(item:ContactSelect){
    item.Switch();
    this.contacts = this.contactSelects.filter(x => x.Selected() === true).map(x => x.GetContact()); 
  }

  Ok(): void {
    this.contacts = this.contactSelects.filter(x => x.Selected() === true).map(x => x.GetContact());
    console.log('dialog start');
    console.log(this.contacts);
    console.log('dialog end');
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
