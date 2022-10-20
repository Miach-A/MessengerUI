import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';

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

  constructor(private breakpointObserver:BreakpointObserver) {

  }
  ngOnInit(): void {
    this.breakpointSubscribe = this.breakpointObserver.observe(["(min-width:1024px)"]).subscribe(x => this.modeSide = x.matches);
  }

  ngOnDestroy():void{
    this.breakpointSubscribe.unsubscribe();
  }

}
