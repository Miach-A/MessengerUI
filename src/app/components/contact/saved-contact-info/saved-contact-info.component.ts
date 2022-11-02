import { Component, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Chat } from 'src/app/models/Chat';
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
  public deleted:boolean = false;

  constructor(
    private messengerState:MessengerStateService,
    private activatedRoute:ActivatedRoute,
    private backendService:BackendService,
    private route:Router) {
    
   }
 
  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
  
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (param) => {
        this.contact = this.messengerState.GetContact(param.get('name') ?? "");
        this.deleted = false;}
    })

    //this.messengerState
    //does not have time to update from the back-end
    //need to emit event from messengerState to active route

/*     console.log(this.messengerState.GetUser()?.contacts);
    this.contact = this.messengerState.GetContact(this.activatedRoute.snapshot.paramMap.get('name') ?? "");
    console.log(this.contact); */
  }

  DeleteContact(){
    this._subscriptions.push(
      this.backendService
        .delete("DeleteContact",this.contact?.name)
        .subscribe({
          next: () => {
            this.messengerState.DeleteContact(this.contact as Contact);
            this.deleted = true;}
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
    this._subscriptions.push(  
      this.backendService.post("PostChat",{name:this.contact?.name}).subscribe({ 
        next: (chat) => {
          const newChat = new Chat(chat as Chat);
          this.messengerState.AddChat(newChat);
          this.route.navigate(['chat',newChat.guid]);
        }
      }));
  }
}
