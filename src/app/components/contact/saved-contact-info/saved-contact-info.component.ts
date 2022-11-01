import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Contact } from 'src/app/models/Contact';
import { MessengerStateService } from 'src/app/services/messenger-state.service';

@Component({
  selector: 'app-saved-contact-info',
  templateUrl: './saved-contact-info.component.html',
  styleUrls: ['./saved-contact-info.component.scss']
})
export class SavedContactInfoComponent implements OnInit {
  public contact?:Contact;
  private _contactName:string = "";
  
  constructor(
    private messengerState:MessengerStateService,
    private activatedRoute:ActivatedRoute
  ) { 

  }
  
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (param) => {
        this._contactName = param.get('name') ?? "";
        this.contact = this.messengerState.GetContact(this._contactName)}
    })
  }

}
