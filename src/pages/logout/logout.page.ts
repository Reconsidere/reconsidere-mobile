import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/providers/auth.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(private authService: AuthService, private navCtrl: NavController) { }

  ngOnInit() {
    this.authService.logout();
    this.navCtrl.navigateRoot(['/login']);
  }

}
