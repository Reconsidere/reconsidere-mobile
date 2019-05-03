import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from '../providers/auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DecriptEncript } from './security/decriptencript';
import { ErrorInterceptor } from './security/error.interceptor';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { JwtInterceptor } from './security/jwt.interceptor';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { Facebook } from '@ionic-native/facebook/ngx';


registerLocaleData(localePt);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
  ],

  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: LOCALE_ID, useValue: 'pt' },
    AuthService,
    AuthGuard,
    DecriptEncript,
    Geolocation,
    NativeGeocoder,
    LocationAccuracy,
    Diagnostic,
    FileTransfer,
    File,
    Facebook
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
