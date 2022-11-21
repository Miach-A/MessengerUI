import { Component, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concat, Subscription } from 'rxjs';
import { Chat } from 'src/app/models/Chat';
import { Contact } from 'src/app/models/Contact';
import { CreateChatDTO } from 'src/app/models/CreateChatDTO';
import { BackendService } from 'src/app/services/backend.service';
import { MessengerStateService } from 'src/app/services/messenger-state.service';
import { SignalrService } from 'src/app/services/signalr.service';

@Component({
  selector: 'app-saved-contact-info',
  templateUrl: './saved-contact-info.component.html',
  styleUrls: ['./saved-contact-info.component.scss']
})
export class SavedContactInfoComponent implements OnInit,OnDestroy {
  private _subscriptions:Subscription[] = [];
  public contact?:Contact;

  constructor(
    private _signalrService:SignalrService,
    private messengerState:MessengerStateService,
    private activatedRoute:ActivatedRoute,
    private backendService:BackendService,
    private route:Router) {

   }

  ngOnInit(): void {
    this._subscriptions.push(
      this.activatedRoute.paramMap.subscribe({
        next: (param) => {
          this.UpdateData(param.get('name') ?? "");
        }
      }));

    this._subscriptions.push(
      this.messengerState.GetUserDataChangeEmitter()
        .subscribe({
          next: () => {this.UpdateData(this.activatedRoute.snapshot.paramMap.get('name') ?? ""); }
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
      this.CreateChat();
      return;
    }

    this.route.navigate(['chat',chat.guid]);
  }

  CreateChat(){
    const contactName = this.contact?.name ?? ""; 
    this._subscriptions.push(
      this.backendService.post("PostChat",
        new CreateChatDTO(
          contactName,
          this.messengerState.GetUser()?.name + "-" + contactName,
          false)).subscribe({
            next: (chat) => {
              const newChat = new Chat(chat as Chat);
              this.messengerState.AddChat(newChat);
              this._signalrService.SendNewChat(newChat.guid);
              this.route.navigate(['chat', newChat.guid]);
            }
          }));
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
