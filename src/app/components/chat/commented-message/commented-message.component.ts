import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/models/Message';

@Component({
  selector: 'app-commented-message',
  templateUrl: './commented-message.component.html',
  styleUrls: ['./commented-message.component.scss']
})
export class CommentedMessageComponent implements OnInit {
  @Input() message!:Message;
  constructor() { }

  ngOnInit(): void {
  }

}
