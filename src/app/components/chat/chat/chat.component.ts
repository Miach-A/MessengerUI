import { Component, ElementRef, OnDestroy, OnInit, ViewChild, AfterViewInit, ViewChildren, QueryList, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';
import { Chat } from 'src/app/models/Chat';
import { ChatEvent } from 'src/app/models/ChatEvent';
import { Message } from 'src/app/models/Message';
import { BackendService } from 'src/app/services/backend.service';
import { MessengerStateService } from 'src/app/services/messenger-state.service';
import { SignalrService } from 'src/app/services/signalr.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit,OnDestroy, AfterViewInit{
  private _isNearBottom = true;
  private _scrollContainer: any;
  private _subscriptions:Subscription[] = [];
  public text:string = "";
  public chat?:Chat;  
  @ViewChild('messages') scrollFrame : ElementRef | undefined;
  @ViewChildren('message') messageView: QueryList<any> | undefined;

  constructor(
    private signalrService:SignalrService,
    private activatedRoute:ActivatedRoute,
    private messengerState:MessengerStateService,
    private backendService:BackendService
  ) { }

  ngOnInit(): void {
    this._subscriptions.push(
      this.activatedRoute.paramMap.subscribe({
        next: (param) => {
          this.UpdateData(param.get('guid') ?? "");
        }
      }));

    this._subscriptions.push(
      this.messengerState.GetUserDataChangeEmitter()
        .subscribe({
          next: () => {
            this.UpdateData(this.activatedRoute.snapshot.paramMap.get('guid') ?? "");
          }
        }));

    this._subscriptions.push(
      this.messengerState.GetChatEventEmitter()
        .subscribe({
          next: (chatEvent: ChatEvent) => {
            this.UpdateChatAfterEventChange(chatEvent)
          }
        }));
  }

  UpdateChatAfterEventChange(chatEvent: ChatEvent){
    console.log(chatEvent);
    if (chatEvent === ChatEvent.Update){
      this.text = this.messengerState.GetTargetMessage()?.text ?? ""; 
    }
  }

  ngAfterViewInit() {
    if (this.scrollFrame != undefined) {
      this._scrollContainer = this.scrollFrame.nativeElement;
    }
    if (this.messageView != undefined) {
      this._subscriptions.push(
        this.messageView.changes.subscribe(() => {
          this.onItemElementsChanged();
        })
      );
    }
  }
 
  UpdateData(chatGuid: string) {
    this.chat = this.messengerState.GetChat(chatGuid);
    if (!this.chat) {
      return;
    }

    this.messengerState.SetChat(this.chat);  
    if (this.messengerState.GetMessages(chatGuid).length < 20){
      this.GetMessagesFromBack(chatGuid).subscribe({
        next: (messages) => this.messengerState.SetMessages(chatGuid, messages)
      });
    }
  }

  SendMessageIfEnter(event:KeyboardEvent){
    if (event.key === 'Enter' && !event.shiftKey){
      this.SendMessage();
    }
  }

  GetMessages():Message[] {
    if (this.chat === undefined){
      return new Array<Message>;
    }
    return this.messengerState.GetMessages(this.chat.guid);
  }

  GetMessagesFromBack(chatGuid:string):Observable<Message[]> {
    const date = this.messengerState.GetMessages(chatGuid)[0]?.date;
    var search;
    if(date === undefined){
      search =  { chatGuid: chatGuid, count: 20}
    }
    else{
      search =  { chatGuid: chatGuid, count: 20, date:date.toString()}
    }
    
    return this.backendService
        .get("Message", undefined, search)
        .pipe(
          map((data: any) => {
            const messages: Message[] = [];
            data.forEach((message: Message) => {
              messages.push(new Message(message));
            });
            return messages;
          }));
  }

  SendMessage(){
/*     const newMessage = this.messengerState.GetMessageDTO(this.text);
    if (newMessage == undefined){
      return;
    }

    this.signalrService.SendMessage(newMessage); */
    this.messengerState.SendMessage(this.text.slice(0, -1));
    this.text = "";
  }

  private onItemElementsChanged(): void {
    if (this._isNearBottom) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    this._scrollContainer.scroll({
      top: this._scrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  private isUserNearBottom(): boolean {
    const threshold = 150;
    const position = this._scrollContainer.scrollTop + this._scrollContainer.offsetHeight;
    const height = this._scrollContainer.scrollHeight;
    return position > height - threshold;
  }

  scrollMessages(event:Event){
    this._isNearBottom = this.isUserNearBottom();
    if (this._scrollContainer.scrollTop === 0
      && this.chat != undefined) {
      const chatGuid = this.chat.guid; 
      this.GetMessagesFromBack(chatGuid).subscribe({
        next : (messages) => {  
          this.messengerState.SetMessages(chatGuid, messages);
          this._scrollContainer.scroll({
            top: 5,
            left: 0,
          });
        }
      });
      
    }
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
