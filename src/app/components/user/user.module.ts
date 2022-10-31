import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInfoComponent } from './user-info/user-info.component';
import { AngularMaterialModule } from 'src/app/modules/angular-material.module';
import {  ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    UserInfoComponent,  
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
  ]
})
export class UserModule { }
