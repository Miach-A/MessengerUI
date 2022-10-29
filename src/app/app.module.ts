import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { AngularMaterialModule } from './modules/angular-material.module';
import { BACKEND_API_URL } from './app-injection-tokens';
import { environment } from 'src/environments/environment';
import { JwtModule } from '@auth0/angular-jwt';
import { ACCES_TOKEN_KEY } from './services/auth.service';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { ContactIconComponent } from './components/contact-icon/contact-icon.component';
import { ContactInfoComponent } from './components/contact-info/contact-info.component';
import { ChatComponent } from './components/chat/chat.component';
import { ChatIconComponent } from './components/chat-icon/chat-icon.component';
import { ChatInfoComponent } from './components/chat-info/chat-info.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';

export function tokenGetter(){
  return localStorage.getItem(ACCES_TOKEN_KEY);
}
@NgModule({
  declarations: [
    AppComponent,
    ContactIconComponent,
    ContactInfoComponent,
    ChatComponent,
    ChatIconComponent,
    ChatInfoComponent,
    HomeComponent,
    LoginComponent,
    RegistrationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularMaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    JwtModule . forRoot ({
      config : {
        tokenGetter : tokenGetter,
        allowedDomains: [environment.backendApi]
      } })
  ],
  providers: [
    {provide:BACKEND_API_URL,useValue:environment.backendApi},
    {provide:HTTP_INTERCEPTORS,useClass:AuthInterceptorService,multi:true}
  ]
  ,
  bootstrap: [AppComponent]
})
export class AppModule { }
