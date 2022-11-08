import { Component, ElementRef, OnDestroy, OnInit, ViewChild, AfterViewInit, ViewChildren, QueryList, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';
import { Chat } from 'src/app/models/Chat';
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
  @HostListener('scroll')
  scrolled(event: any): void {
    this._isNearBottom = this.isUserNearBottom();
  }

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
              this.UpdateData(this.activatedRoute.snapshot.paramMap.get('guid') ?? ""); }
          }));
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
 
  UpdateData(guid: string) {
    this.chat = this.messengerState.GetChat(guid);
    if (!this.chat) {
      return;
    }

    this.messengerState.SetChat(this.chat);  
    if (this.messengerState.GetMessages(guid).length < 20){
/*       this._subscriptions.push(
        this.GetMessagesFromBack(guid)
      ); */ 
      this.GetMessagesFromBack(guid);
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

  GetMessagesFromBack(chatGuid:string){
    const date = this.messengerState.GetMessages(chatGuid)[0]?.date;
    var search;
    if(date === undefined){
      search =  { chatGuid: chatGuid, count: 20}
    }
    else{
      search =  { chatGuid: chatGuid, count: 20, date:date.toString()}
    }
    
    this._subscriptions.push(
      this.backendService
        .get("Message", undefined, search)
        .pipe(
          map((data: any) => {
            const messages: Message[] = [];
            data.forEach((message: Message) => {
              messages.push(new Message(message));
            });
            return messages;
          }))
        .subscribe({
          next: (data) => this.messengerState.SetMessages(chatGuid, data)
        })
    );
  }

  SendMessage(){
    const newMessage = this.messengerState.GetMessageDTO(this.text);
    if (newMessage == undefined){
      return;
    }

    this.signalrService.SendMessage(newMessage);
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
    console.log(this._scrollContainer.scroll);
    console.log(this._scrollContainer.scrollHeight);
    console.log(this._scrollContainer.scrollToBottom);
    console.log(this._scrollContainer.scrollTop);
    console.log(this._scrollContainer.offsetHeight);
    if (this._scrollContainer.scrollTop === 0
      && this.chat != undefined) {
      console.log("get");
      this.GetMessagesFromBack(this.chat.guid);
    }
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
