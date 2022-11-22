import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { StringInputDialogComponent } from './components/utilities/string-input-dialog/string-input-dialog.component';
import { InputStringDialog } from './models/InputStringDialog';
import { AuthService } from './services/auth.service';
import { ChatService } from './services/chat.service';
import { MessengerStateService } from './services/messenger-state.service';
import { SignalrService } from './services/signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,OnDestroy {
  public title = 'MessengerUI';
  public inputString = "";
  public sidenavOpened:boolean = true;
  public modeSide:boolean = false;
  private _subscriptions: Subscription[] = [];

  constructor(private breakpointObserver:BreakpointObserver,
    private signalrService: SignalrService,
    private chatService:ChatService,
    public authService: AuthService,
    public messengerState: MessengerStateService,
    public inputStringDialog: MatDialog) {

  }

  ngOnInit(): void {
    this._subscriptions.push(this.breakpointObserver.observe(["(min-width:1024px)"]).subscribe(x => this.modeSide = x.matches));
    if (this.authService.IsAuthenticated()){
      this._subscriptions.push(this.authService.GetUserInfo().subscribe());
    }

    this.signalrService.EventsOn();

    if (this.authService.IsAuthenticated()
      && !this.signalrService.isConnected()){
      this.signalrService.Connect();
    }   
  }

  ngOnDestroy():void{
    this._subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

    this.signalrService.EventsOff();
    this.signalrService.Disconnect();
  }

  Login(name: string,password:string) {
    this.authService.LogIn(name,password);
  }

  Logout() {
    this.authService.Logout(); 
  }

  CreatePublicChat(){
    const dialogRef = this.inputStringDialog.open(StringInputDialogComponent, {
      data: new InputStringDialog("Input chat name"),
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined){
        return;
      }
      this.chatService.CreateChat(undefined,result,true);
    });
  }

}
