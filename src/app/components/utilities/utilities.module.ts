import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StringInputDialogComponent } from './string-input-dialog/string-input-dialog.component';
import { AngularMaterialModule } from 'src/app/modules/angular-material.module';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ContactSelectionComponent } from './contact-selection/contact-selection.component';


@NgModule({
  declarations: [
    StringInputDialogComponent, 
    ContactSelectionComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    MatDialogModule
  ]
})
export class UtilitiesModule { }
