import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat/chat.component';
import { ContactInfoComponent } from './components/contact/contact-info/contact-info.component';
import { ContactsSearchComponent } from './components/contact/contacts-search/contacts-search.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { UserInfoComponent } from './components/user/user-info/user-info.component';
import { LoginGuardService } from './services/login-guard.service';

const routes: Routes = [
  {path:"",component:HomeComponent},
  {path:"login",component:LoginComponent, canActivate: [LoginGuardService] },
  {path:"registration",component:RegistrationComponent,canActivate: [LoginGuardService]},
  {path:"user", component:UserInfoComponent,canActivate: [LoginGuardService]},
  {path:"searchcontact",component:ContactsSearchComponent,canActivate: [LoginGuardService]},
  {path:"contactinfo/:name",component:ContactInfoComponent,canActivate: [LoginGuardService]},
  {path:"chat/:guid",component:ChatComponent,canActivate: [LoginGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
