import { Component, Input, OnInit, OnDestroy} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  @Input() contact!:Contact;

  constructor(
    private backendService:BackendService,
    private messengerState:MessengerStateService

  ) { }

  ngOnInit(): void {  }

  ContactSaved():boolean{
    const user = this.messengerState.GetUser();
    if (user === undefined){
      return false;
    } 

    if (!!user.contacts.find(x => x.name === this.contact.name)){
      return true;
    }
    
    return false;
  }

  Submit() {
    this._subscriptions.push(
      this.backendService
        .post("PostContact", { name: this.contact.name })
        .subscribe({
          next: (contact) => { this.messengerState.AddContact(new Contact(contact as Contact)); }
        }));
  }

  ngOnDestroy(){
    this._subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
