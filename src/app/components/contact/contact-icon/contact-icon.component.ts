import { Component, Input, OnInit } from '@angular/core';
import { Contact } from 'src/app/models/Contact';
import { MessengerStateService } from 'src/app/services/messenger-state.service';

@Component({
  selector: 'app-contact-icon',
  templateUrl: './contact-icon.component.html',
  styleUrls: ['./contact-icon.component.scss']
})
export class ContactIconComponent implements OnInit {

  @Input()
  contact!:Contact;
  constructor(private messengerState:MessengerStateService) { }

  ngOnInit(): void {
    
  }

  SetCurrentContact(){
    this.messengerState.SetContact(this.contact);
    //this.messengerState.SetChat(this.contact);
  }

}
