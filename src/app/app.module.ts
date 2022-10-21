import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { AngularMaterialModule } from './modules/angular-material.module';
import { AUTH_API_URL, MESSENGER_API_URL } from './app-injection-tokens';
import { environment } from 'src/environments/environment';
import { JwtModule } from '@auth0/angular-jwt';
import { ACCES_TOKEN_KEY } from './services/auth.service';

export function tokenGetter(){
  return localStorage.getItem(ACCES_TOKEN_KEY);
}
@NgModule({
  declarations: [
    AppComponent
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
        allowedDomains: [environment.messengerApi]
      } })
  ],
  providers: [{
    provide:AUTH_API_URL,
    useValue:environment.authApi
  },
  {
    provide:MESSENGER_API_URL,
    useValue:environment.messengerApi
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
