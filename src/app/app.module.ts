import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


//=======================Firabase===================
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';



@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot({ mode: 'md' }), AppRoutingModule, ReactiveFormsModule,AngularFireModule.initializeApp(environment.firebaseConfig),],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
