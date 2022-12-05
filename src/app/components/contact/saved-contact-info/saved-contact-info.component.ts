import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Contact } from 'src/app/models/Contact';
import { CreateContactDTO } from 'src/app/models/CreateContactDTO';
import { BackendService } from 'src/app/services/backend.service';
import { ChatService } from 'src/app/services/chat.service';
import { MessengerStateService } from 'src/app/services/messenger-state.service';

@Component({
  selector: 'app-saved-contact-info',
  templateUrl: './saved-contact-info.component.html',
  styleUrls: ['./saved-contact-info.component.scss']
})
export class SavedContactInfoComponent implements OnInit, OnDestroy {
  private _subscriptions: Subscription[] = [];
  public contact?: Contact;
  public saved: boolean = false;
  public isMe: boolean = false;

  constructor(
    private _messengerState: MessengerStateService,
    private _activatedRoute: ActivatedRoute,
    private _backendService: BackendService,
    private _route: Router,
    private _chatService: ChatService) {

  }

  ngOnInit(): void {
    this._subscriptions.push(
      this._activatedRoute.paramMap.subscribe({
        next: (param) => {
          this.UpdateData(param.get('contactname') ?? "");
        }
      }));

    this._subscriptions.push(
      this._messengerState.GetUserDataChangeEmitter()
        .subscribe({
          next: () => {
            const routeSnapShot = this._activatedRoute.snapshot;
            this.UpdateData(routeSnapShot.paramMap.get('contactname') ?? "");
          }
        }));
  }

  ContactSaved() {
    const user = this._messengerState.GetUser();
    if (user === undefined) {
      this.saved = false;
      return;
    }

    if (!!user.contacts.find(x => x.name === this.contact?.name) || user.name === this.contact?.name) {
      this.saved = true;
      return;
    }

    this.saved = false;
  }

  SaveContact() {
    if (this.contact === undefined) {
      return;
    }

    this._subscriptions.push(
      this._backendService
        .post("PostContact", new CreateContactDTO(this.contact.name))
        .subscribe({
          next: (contact) => { 
            this.contact = new Contact(contact as Contact);
            this._messengerState.AddContact(this.contact); 
            this.saved = true; }
        }));
  }

  UpdateData(name: string) {
    this.contact = this._messengerState.GetContact(name);

    if (this.contact != undefined) {
      this.saved = true;
    }
    else {
      this.saved = false;
      const chat = this._messengerState.GetCurrentChat();
      if (chat != undefined) {
        this.contact = this._messengerState.GetContact(name, chat.guid);
      }
    }

    this.IsMe();
  }

  IsMe() {
    this.isMe = false;
    if (this.contact?.name === this._messengerState.GetUser()?.name) {
      this.isMe = true;
    }
  }

  DeleteContact() {
    this._subscriptions.push(
      this._backendService
        .delete("DeleteContact", this.contact?.name)
        .subscribe({
          next: () => {
            this._messengerState.DeleteContact(this.contact as Contact);
            this._route.navigate(['./'], { relativeTo: this._activatedRoute.parent });
          }
        }));
  }

  OpenChat() {
    const user = this._messengerState.GetUser();
    if (!user || !this.contact) {
      return;
    }

    const chat = user.chats.find(x => x.users.length === 2 && x.users.find(y => y.name === this.contact!.name));
    if (!chat) {
      const contacts = new Array<string>();
      if (this.contact?.name !== undefined) {
        contacts.push(this.contact?.name);
      }
      this._chatService.CreateChat(contacts);
      return;
    }

    this._route.navigate(['chat', chat.guid]);
  }

  SavedContact() {
    return !!this._messengerState.GetUser()?.contacts.find(x => x === this.contact);
  }

  ParentRoute() {
    this._route.navigate(['./'], { relativeTo: this._activatedRoute.parent });
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
