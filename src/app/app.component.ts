import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from 'src/providers/auth.service';
import { Customer } from 'src/models/customer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Conta',
      url: '/signup',
      icon: 'contact'
    },
    {
      title: 'Início',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Agendamento',
      url: '/scheduling',
      icon: 'pin'
    },
    {
      title: 'Sair',
      url: '/logout',
      icon: 'exit'
    },
  ];

  currentCustomer: Customer;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authenticationService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
    this.authenticationService.currentToken.subscribe(x => this.currentCustomer = x);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }


  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
}
}


