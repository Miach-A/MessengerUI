import { Component, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Contact } from 'src/app/models/Contact';
import { BackendService } from 'src/app/services/backend.service';
import { MessengerStateService } from 'src/app/services/messenger-state.service';

@Component({
  selector: 'app-saved-contact-info',
  templateUrl: './saved-contact-info.component.html',
  styleUrls: ['./saved-contact-info.component.scss']
})
export class SavedContactInfoComponent implements OnInit,OnDestroy {
  private _subscriptions:Subscription[] = [];
  public contact?:Contact;

  constructor(
    private messengerState:MessengerStateService,
    private activatedRoute:ActivatedRoute,
    private backendService:BackendService) {
    
   }
 
  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
  
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (param) => {
        this.contact = this.messengerState.GetContact(param.get('name') ?? "")}
    })
  }

  DeleteContact(){
    this._subscriptions.push(
      this.backendService
        .post("PostContact", { name: this.contact?.name })
        .subscribe({
          next: (contact) => { this.messengerState.AddContact(new Contact(contact as Contact)); }
        }));
  }
}
