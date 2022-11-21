import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactIconComponent } from './contact-icon/contact-icon.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { RouterLink, RouterModule } from '@angular/router';
import { ContactsSearchComponent } from './contacts-search/contacts-search.component';
import { AngularMaterialModule } from 'src/app/modules/angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactSearchResultComponent } from './contact-search-result/contact-search-result.component';
import { SavedContactInfoComponent } from './saved-contact-info/saved-contact-info.component';
import { ContactSelectionComponent } from './contact-selection/contact-selection.component';


@NgModule({
  declarations: [
    ContactIconComponent,
    ContactInfoComponent,
    ContactsSearchComponent,
    ContactSearchResultComponent,
    SavedContactInfoComponent,
    ContactSelectionComponent,
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
