import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subscription } from 'rxjs';
import { User } from './models/User';
import { ACCES_TOKEN_KEY, AuthService } from './services/auth.service';
import { BackendService } from './services/backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MessengerUI';
  sidenavOpened:boolean = true;
  breakpointSubscribe!:Subscription;
  modeSide:boolean = false;
  subscriptions: Subscription[] = [];
  //token:string = "";
  //public user: User = new User();

  constructor(private breakpointObserver:BreakpointObserver,
    public authService: AuthService,
    //private backendService:BackendService,
    //public signalrService: SignalrService,
    private JwtHelper: JwtHelperService) {

  }

  ngOnInit(): void {
    this.breakpointSubscribe = this.breakpointObserver.observe(["(min-width:1024px)"]).subscribe(x => this.modeSide = x.matches);
    this.authService.GetUserInfo();
    /*var token = localStorage.getItem(ACCES_TOKEN_KEY);
    if (token != null){
      this.token = token;
    }  */
  }
  ngAfterViewChecked(){
    console.log(this.authService.CurentUser());
  }

  ngOnDestroy():void{
    this.breakpointSubscribe.unsubscribe();
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
