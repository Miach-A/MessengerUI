import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { MessengerStateService } from './services/messenger-state.service';
import { SignalrService } from './services/signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'MessengerUI';
  public sidenavOpened:boolean = true;
  public modeSide:boolean = false;
  private _subscriptions: Subscription[] = [];

  constructor(private breakpointObserver:BreakpointObserver,
    public authService: AuthService,
    public messengerState: MessengerStateService,
    //private backendService:BackendService,
    public signalrService: SignalrService,
    private JwtHelper: JwtHelperService) {

  }

  ngOnInit(): void {
    this._subscriptions.push(this.breakpointObserver.observe(["(min-width:1024px)"]).subscribe(x => this.modeSide = x.matches));
    if (this.authService.IsAuthenticated()){
      this._subscriptions.push(this.authService.GetUserInfo().subscribe());
    }

    this.signalrService.EventsOn();
    this.signalrService.Connect();
  }

  ngOnDestroy():void{
    this._subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  Login(name: string,password:string) {
    this.authService.LogIn(name,password);
  }

  Logout() {
    this.authService.Logout(); 
    //this.signalrService.Disconnect();
    //this.curentGroup = null;
  }

}
