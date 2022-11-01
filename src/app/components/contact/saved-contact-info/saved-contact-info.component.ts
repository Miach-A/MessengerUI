import { Component, OnInit } from '@angular/core';
import { Contact } from 'src/app/models/Contact';
import { MessengerStateService } from 'src/app/services/messenger-state.service';

@Component({
  selector: 'app-saved-contact-info',
  templateUrl: './saved-contact-info.component.html',
  styleUrls: ['./saved-contact-info.component.scss']
})
export class SavedContactInfoComponent implements OnInit {
  public contact?:Contact;
  
  constructor(
    private messengerState:MessengerStateService
  ) { 

  }
  
  ngOnInit(): void {
    this.contact = this.messengerState.GetContact();
    console.log(this.contact );
  }

}
