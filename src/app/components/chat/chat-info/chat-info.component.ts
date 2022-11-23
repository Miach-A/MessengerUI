import { Component, Input, OnInit } from '@angular/core';
import { concatMap, of, switchMap } from 'rxjs';
import { AddChatUserDTO } from 'src/app/models/AddChatUserDTO';
import { Chat } from 'src/app/models/Chat';
import { BackendService } from 'src/app/services/backend.service';
import { MessengerStateService } from 'src/app/services/messenger-state.service';

@Component({
  selector: 'app-chat-info',
  templateUrl: './chat-info.component.html',
  styleUrls: ['./chat-info.component.scss']
})
export class ChatInfoComponent implements OnInit {
  
  @Input()
  chat:Chat|undefined;

  constructor(private messengerState:MessengerStateService,
    private backendService:BackendService) { }

  ngOnInit(): void {
  }

  public AddMembers() {
    this.messengerState.SelectContacts().pipe(
      concatMap((contacts) => {
        console.log('contacts');
        console.log(contacts);
        if (contacts === undefined || contacts.length === 0){
          return of(false);
        }
        return this.backendService.post("PostChatUser",
          new AddChatUserDTO(this.chat?.guid ?? "", contacts.map(x => x.name)))
      }
      )
    ).subscribe({
      next: (result) => console.log(result)
    });
  }
}
