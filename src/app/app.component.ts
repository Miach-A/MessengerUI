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
  public user: User = new User();

  constructor(private breakpointObserver:BreakpointObserver,
    public authService: AuthService,
    private backendService:BackendService,
    //public signalrService: SignalrService,
    private JwtHelper: JwtHelperService) {

  }
  ngOnInit(): void {
    this.breakpointSubscribe = this.breakpointObserver.observe(["(min-width:1024px)"]).subscribe(x => this.modeSide = x.matches);
    /*var token = localStorage.getItem(ACCES_TOKEN_KEY);
    if (token != null){
      this.token = token;
    }  */
  }

  ngOnDestroy():void{
    this.breakpointSubscribe.unsubscribe();
  }

  login(name: string,password:string) {
    var sub = this.authService.login(name,password).subscribe({
      next: (token) => {
      localStorage.setItem(ACCES_TOKEN_KEY, token.access_token);
      //this.token = token.access_token;
      //var decodeToken = this.JwtHelper.decodeToken(token.access_token);
      //this.user.name = decodeToken.name;
      //this.user = decodeToken.sub;
      //this.signalrService.user = this.user;
      //this.signalrService.Connect(); 

       var subUser = this.backendService.get("User").subscribe({
        next: (user) => {
          this.user = user as User;
          console.log(this.user);
        },
        error: (er) => {
          alert(er.message);
          //console.log(er);
          //this.authService.logout();
        }
      });
      this.subscriptions.push(subUser);

    },
    error: (error) => {
      alert('Login error');
    }
  });


    this.subscriptions.push(sub);
  }

  logout() {
    this.authService.logout();
    //this.signalrService.Disconnect();
    //this.curentGroup = null;
  }

}
