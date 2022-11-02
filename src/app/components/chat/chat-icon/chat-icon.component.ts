import { Component, Input, OnInit } from '@angular/core';
import { Chat } from 'src/app/models/Chat';

@Component({
  selector: 'app-chat-icon',
  templateUrl: './chat-icon.component.html',
  styleUrls: ['./chat-icon.component.scss']
})
export class ChatIconComponent implements OnInit {
  @Input()
  chat!:Chat;
  constructor() { }

  ngOnInit(): void {
  }

}
