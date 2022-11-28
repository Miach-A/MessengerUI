import { Component, Input, OnInit } from '@angular/core';
import { Chat } from 'src/app/models/Chat';
import { Contact } from 'src/app/models/Contact';

@Component({
  selector: 'app-contact-icon',
  templateUrl: './contact-icon.component.html',
  styleUrls: ['./contact-icon.component.scss']
})
export class ContactIconComponent implements OnInit {

  @Input()
  contact!:Contact;

  @Input()
  chat?:Chat;

  constructor() { }

  ngOnInit(): void {
    
  }
}
