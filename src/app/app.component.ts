import { Component, ViewChildren, QueryList } from '@angular/core';

import { Platform, NavController, IonRouterOutlet, ActionSheetController, PopoverController, ModalController, MenuController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from 'src/providers/auth.service';
import { Customer } from 'src/models/customer';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';


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
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  messageCode: any;


  constructor(
    private naveCltr: NavController,
    private http: HttpClient,
    private alertCtrl: AlertController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authenticationService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
    this.authenticationService.currentToken.subscribe(x => this.currentCustomer = x);
    this.http.get("./../assets/data/message.json").subscribe(response => this.loadMessages(response));
    this.platform.backButton.subscribe(async () => {
      if (this.router.url === '/' || this.router.url === '/login?returnUrl=%2F' || this.router.url === '/login' || this.router.url.toString() === '/home') {
        let choice = await this.alertChoice();
        if (choice === true) {
          navigator['app'].exitApp();
        }
      } else {
        this.naveCltr.back();
      }
    });

  }

  async alertChoice() {
    return new Promise(async (resolve) => {
      const confirm = await this.alertCtrl.create({
        header: 'Confirmar',
        message: this.messageCode['INFO']['IRE001']['summary'],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              return resolve(false);
            },
          },
          {
            text: 'OK',
            handler: () => {
              return resolve(true);
            },
          },
        ],
      });

      await confirm.present();
    });
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

  loadMessages(response) {
    this.messageCode = response;
  }



}


