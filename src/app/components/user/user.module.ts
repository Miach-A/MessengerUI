import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInfoComponent } from './user-info/user-info.component';
import { AngularMaterialModule } from 'src/app/modules/angular-material.module';

@NgModule({
  declarations: [
    UserInfoComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
  ]
})
export class UserModule { }
