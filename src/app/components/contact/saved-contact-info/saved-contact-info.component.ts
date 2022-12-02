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
    private messengerState: MessengerStateService,
    private activatedRoute: ActivatedRoute,
    private backendService: BackendService,
    private route: Router,
    private chatService: ChatService) {

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
          next: () => {
            const routeSnapShot = this.activatedRoute.snapshot;
            this.UpdateData(routeSnapShot.paramMap.get('contactname') ?? "");
          }
        }));
  }

  ContactSaved() {
    const user = this.messengerState.GetUser();
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
      this.backendService
        .post("PostContact", new CreateContactDTO(this.contact.name))
        .subscribe({
          next: (contact) => { 
            this.contact = new Contact(contact as Contact);
            this.messengerState.AddContact(this.contact); 
            this.saved = true; }
        }));
  }

  UpdateData(name: string) {
    this.contact = this.messengerState.GetContact(name);

    if (this.contact != undefined) {
      this.saved = true;
    }
    else {
      this.saved = false;
      const chat = this.messengerState.GetCurrentChat();
      if (chat != undefined) {
        this.contact = this.messengerState.GetContact(name, chat.guid);
      }
    }

    this.IsMe();
  }

  IsMe() {
    this.isMe = false;
    if (this.contact?.name === this.messengerState.GetUser()?.name) {
      this.isMe = true;
    }
  }

  DeleteContact() {
    this._subscriptions.push(
      this.backendService
        .delete("DeleteContact", this.contact?.name)
        .subscribe({
          next: () => {
            this.messengerState.DeleteContact(this.contact as Contact);
            //this.UpdateData(this.contact?.name ?? "");
            this.route.navigate(['./'], { relativeTo: this.activatedRoute.parent });
          }
        }));
  }

  OpenChat() {
    const user = this.messengerState.GetUser();
    if (!user || !this.contact) {
      return;
    }

    const chat = user.chats.find(x => x.users.length === 2 && x.users.find(y => y.name === this.contact!.name));
    if (!chat) {
      const contacts = new Array<string>();
      if (this.contact?.name !== undefined) {
        contacts.push(this.contact?.name);
      }
      this.chatService.CreateChat(contacts);
      return;
    }

    this.route.navigate(['chat', chat.guid]);
  }

  SavedContact() {
    return !!this.messengerState.GetUser()?.contacts.find(x => x === this.contact);
  }

  ParentRoute() {
    this.route.navigate(['./'], { relativeTo: this.activatedRoute.parent });
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
