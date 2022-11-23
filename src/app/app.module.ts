import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from './modules/angular-material.module';
import { BACKEND_API_URL, SIGNALR_URL } from './app-injection-tokens';
import { environment } from 'src/environments/environment';
import { JwtModule } from '@auth0/angular-jwt';
import { ACCES_TOKEN_KEY } from './services/auth.service';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ChatModule } from './components/chat/chat.module';
import { ContactModule } from './components/contact/contact.module';
import { UserModule } from './components/user/user.module';
import { ContactSelectionComponent } from './components/utilities/contact-selection/contact-selection.component';
import { UtilitiesModule } from './components/utilities/utilities.module';



export function tokenGetter(){
  return localStorage.getItem(ACCES_TOKEN_KEY);
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegistrationComponent
  ],
  entryComponents:[ContactSelectionComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularMaterialModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ChatModule,
    ContactModule,
    UserModule,
    UtilitiesModule,
    HttpClientModule,
    JwtModule . forRoot ({
      config : {
        tokenGetter : tokenGetter,
        allowedDomains: [environment.backendApi]
      } })
  ],
  providers: [
    {provide:BACKEND_API_URL,useValue:environment.backendApi},
    {provide:SIGNALR_URL,useValue:environment.signalR},
    {provide:HTTP_INTERCEPTORS,useClass:AuthInterceptorService,multi:true}
  ]
  ,
  bootstrap: [AppComponent]
})
export class AppModule { }
