import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactIconComponent } from './contact-icon/contact-icon.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { RouterLink } from '@angular/router';
import { ContactsSearchComponent } from './contacts-search/contacts-search.component';
import { AngularMaterialModule } from 'src/app/modules/angular-material.module';


@NgModule({
  declarations: [
    ContactIconComponent,
    ContactInfoComponent,
    ContactsSearchComponent
  ],
  imports: [
    CommonModule,
    RouterLink,
    AngularMaterialModule
  ],
  exports:[
    ContactIconComponent,
    ContactsSearchComponent
  ]
})
export class ContactModule { }
