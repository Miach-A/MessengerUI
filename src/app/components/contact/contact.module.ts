import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactIconComponent } from './contact-icon/contact-icon.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { RouterLink, RouterModule } from '@angular/router';
import { ContactsSearchComponent } from './contacts-search/contacts-search.component';
import { AngularMaterialModule } from 'src/app/modules/angular-material.module';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ContactIconComponent,
    ContactInfoComponent,
    ContactsSearchComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    RouterLink,
    ReactiveFormsModule, 
    AngularMaterialModule
  ],
  exports:[
    ContactIconComponent,
    ContactsSearchComponent
  ]
})
export class ContactModule { }
