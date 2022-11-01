import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Contact } from 'src/app/models/Contact';
import { BackendService } from 'src/app/services/backend.service';
import { MessengerStateService } from 'src/app/services/messenger-state.service';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit {
  @Input() contact!:Contact;
  constructor(
    private backendService:BackendService,
    private messengerState:MessengerStateService

  ) { }

  ngOnInit(): void {  }

  Submit(){
    this.backendService.post("PostContact",{name:this.contact.name}).subscribe({
      next: (contact) => {this.messengerState.AddContact(new Contact(contact as Contact));}
    })
  }
}
