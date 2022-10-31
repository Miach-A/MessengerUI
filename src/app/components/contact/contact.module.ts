import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactIconComponent } from './contact-icon/contact-icon.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { RouterLink } from '@angular/router';


@NgModule({
  declarations: [
    ContactIconComponent,
    ContactInfoComponent
  ],
  imports: [
    CommonModule,
    RouterLink
  ],
  exports:[
    ContactIconComponent
  ]
})
export class ContactModule { }
