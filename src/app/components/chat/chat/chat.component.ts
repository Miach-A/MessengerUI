import { Component, ElementRef, OnDestroy, OnInit, ViewChild, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';
import { Chat } from 'src/app/models/Chat';
import { ChatEvent } from 'src/app/models/ChatEvent';
import { Message } from 'src/app/models/Message';
import { BackendService } from 'src/app/services/backend.service';
import { ChatService } from 'src/app/services/chat.service';
import { MessengerStateService } from 'src/app/services/messenger-state.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  private _isNearBottom = true;
  private _scrollContainer: any;
  private _subscriptions: Subscription[] = [];
  public chatName: string = "";
  public openChatInfo = false;
  public canCancel: boolean = false;
  public edit: boolean = false;
  public forward: boolean = false;
  public comment: boolean = false;
  public text: string = "";
  public chat?: Chat;
  public targetMessage?: Message;
  @ViewChild('messages') scrollFrame: ElementRef | undefined;
  @ViewChildren('message') messageView: QueryList<any> | undefined;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _messengerState: MessengerStateService,
    private _backendService: BackendService,
    private _chatService: ChatService,
    private _route: Router,
  ) { }

  ngOnInit(): void {
    this._subscriptions.push(
      this._activatedRoute.paramMap.subscribe({
        next: (param) => {
          this.UpdateData(param.get('guid') ?? "");
        }
      }));

    this._subscriptions.push(
      this._messengerState.GetUserDataChangeEmitter()
        .subscribe({
          next: () => {
            this.UpdateData(this._activatedRoute.snapshot.paramMap.get('guid') ?? "");
          }
        }));

    this._subscriptions.push(
      this._messengerState.GetChatEventEmitter()
        .subscribe({
          next: (chatEvent: ChatEvent) => {
            this.UpdateChatAfterEventChange(chatEvent)
          }
        }));
  }

  UpdateChatAfterEventChange(chatEvent: ChatEvent) {
    if (chatEvent === ChatEvent.Update) {
      this.text = this._messengerState.GetTargetMessage()?.text ?? "";
    }

    this.targetMessage = this._messengerState.GetTargetMessage();
    this.edit = chatEvent === ChatEvent.Update;
    this.comment = chatEvent === ChatEvent.Comment;
    this.forward = chatEvent === ChatEvent.Forward;
    this.canCancel = chatEvent === ChatEvent.Update || chatEvent === ChatEvent.Comment || chatEvent === ChatEvent.Forward;
  }

  CanselEvent() {
    this._messengerState.CancelChatEvent();
    this.text = "";
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
    this.chat = this._messengerState.GetChat(chatGuid);
    if (!this.chat) {
      return;
    }

    this.chatName = this._chatService.GetChatName(this.chat);

    this._messengerState.SetChat(this.chat);
    if (this._messengerState.GetMessages(chatGuid).length < 20) {
      this.GetMessagesFromBack(chatGuid).subscribe({
        next: (messages) => this._messengerState.SetMessages(chatGuid, messages)
      });
    }
  }

  SendMessageIfEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.SendMessage();
    }
  }

  GetMessages(): Message[] {
    if (this.chat === undefined) {
      return new Array<Message>;
    }
    return this._messengerState.GetMessages(this.chat.guid);
  }

  GetMessagesFromBack(chatGuid: string): Observable<Message[]> {
    const date = this._messengerState.GetMessages(chatGuid)[0]?.date;
    var search;
    if (date === undefined) {
      search = { chatGuid: chatGuid, count: 20 }
    }
    else {
      search = { chatGuid: chatGuid, count: 20, date: date.toString() }
    }

    return this._backendService
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

  SendMessage() {
    this._messengerState.SendMessage(this.text);
    this.text = "";
  }

  OpenCloseChatInfo() {
    this.openChatInfo = !this.openChatInfo;
    if (!this.openChatInfo) {
      this._route.navigate(['./'], { relativeTo: this._activatedRoute });
    }
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

  scrollMessages(event: Event) {
    this._isNearBottom = this.isUserNearBottom();
    if (this._scrollContainer.scrollTop === 0
      && this.chat != undefined) {
      const chatGuid = this.chat.guid;
      this.GetMessagesFromBack(chatGuid).subscribe({
        next: (messages) => {
          this._messengerState.SetMessages(chatGuid, messages);
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
