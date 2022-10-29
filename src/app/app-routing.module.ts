import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { ContactInfoComponent } from './components/contact-info/contact-info.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginGuardService } from './services/login-guard.service';

const routes: Routes = [
  {path:"",component:HomeComponent},
  {path:"login",component:LoginComponent, canActivate: [LoginGuardService] },
  {path:"registration",component:RegistrationComponent,canActivate: [LoginGuardService]},
  {path:"contactinfo/:name",component:ContactInfoComponent},
  {path:"chat/:guid",component:ChatComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
