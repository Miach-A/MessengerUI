import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat/chat.component';
import { ContactInfoComponent } from './components/contact/contact-info/contact-info.component';
import { ContactSearchResultComponent } from './components/contact/contact-search-result/contact-search-result.component';
import { SavedContactInfoComponent } from './components/contact/saved-contact-info/saved-contact-info.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { UserInfoComponent } from './components/user/user-info/user-info.component';
import { LoginGuardService } from './services/guards/login-guard.service';
import { LogoutGuardService } from './services/guards/logout-guard.service';

const routes: Routes = [
  {path:"",component:HomeComponent},
  {path:"login",component:LoginComponent, canActivate: [LogoutGuardService] },
  {path:"registration",component:RegistrationComponent,canActivate: [LogoutGuardService]},
  {path:"user", component:UserInfoComponent,canActivate: [LoginGuardService]},
  {path:"contactsearchresult",component:ContactSearchResultComponent,canActivate: [LoginGuardService]},
  {path:"contactinfo/:name",component:SavedContactInfoComponent,canActivate: [LoginGuardService]},
  {path:"chat/:guid",component:ChatComponent,canActivate: [LoginGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
