import { Component, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Contact } from 'src/app/models/Contact';
import { BackendService } from 'src/app/services/backend.service';
import { ChatService } from 'src/app/services/chat.service';
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
    private backendService:BackendService,
    private route:Router,
    private chatService:ChatService) {

   }

  ngOnInit(): void {
    this._subscriptions.push(
      this.activatedRoute.paramMap.subscribe({
        next: (param) => {
          this.UpdateData(param.get('contactname') ?? "");
        }
      }));

    this._subscriptions.push(
      this.messengerState.GetUserDataChangeEmitter()
        .subscribe({
          next: () => {this.UpdateData(this.activatedRoute.snapshot.paramMap.get('contactname') ?? ""); }
        }));
  }

  UpdateData(name:string){
    this.contact = this.messengerState.GetContact(name);
  }

  DeleteContact(){
    this._subscriptions.push(
      this.backendService
        .delete("DeleteContact",this.contact?.name)
        .subscribe({
          next: () => {
            this.messengerState.DeleteContact(this.contact as Contact);
          }
        }));
  }

  OpenChat(){
    const user = this.messengerState.GetUser();
    if (!user || !this.contact){
      return;
    }

    const chat = user.chats.find(x => x.users.length === 2 && x.users.find(y => y.name === this.contact!.name));
    if (!chat){
      const contacts = new Array<string>();
      if (this.contact?.name !== undefined){
        contacts.push(this.contact?.name);
      }
      this.chatService.CreateChat(contacts);
      return;
    }

    this.route.navigate(['chat',chat.guid]);
  }

  SavedContact(){
    return !!this.messengerState.GetUser()?.contacts.find(x => x === this.contact);
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
