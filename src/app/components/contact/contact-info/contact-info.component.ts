import { Component, Input, OnInit } from '@angular/core';
import { Contact } from 'src/app/models/Contact';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit {

  @Input() contact!:Contact;
  constructor() { }

  ngOnInit(): void {
  }

}
