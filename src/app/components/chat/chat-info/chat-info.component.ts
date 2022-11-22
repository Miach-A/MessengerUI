import { Component, Input, OnInit } from '@angular/core';
import { Chat } from 'src/app/models/Chat';

@Component({
  selector: 'app-chat-info',
  templateUrl: './chat-info.component.html',
  styleUrls: ['./chat-info.component.scss']
})
export class ChatInfoComponent implements OnInit {
  
  @Input()
  chat:Chat|undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
