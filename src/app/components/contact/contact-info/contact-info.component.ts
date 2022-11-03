import { Component, Input, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { Contact } from 'src/app/models/Contact';
import { BackendService } from 'src/app/services/backend.service';
import { MessengerStateService } from 'src/app/services/messenger-state.service';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit, OnDestroy {
  private _subscriptions:Subscription[] = [];
  public saved:boolean = false;
  @Input() contact!:Contact;

  constructor(
    private backendService:BackendService,
    private messengerState:MessengerStateService

  ) { }

  ngOnInit(): void { 
    this.ContactSaved();
  }

  ContactSaved(){
    const user = this.messengerState.GetUser();
    if (user === undefined){
      this.saved = false;
      return;
    } 

    if (!!user.contacts.find(x => x.name === this.contact.name) || user.name === this.contact.name){
      this.saved = true;
      return;
    }
    
    this.saved = false;
  }

  Submit() {
    this._subscriptions.push(
      this.backendService
        .post("PostContact", { name: this.contact.name })
        .subscribe({
          next: (contact) => { this.messengerState.AddContact(new Contact(contact as Contact)); this.saved = true; }
        }));
  }

  ngOnDestroy(){
    this._subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
