import { Component, OnInit } from '@angular/core';
import { Credentials } from 'src/models/credentials';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/providers/auth.service';
import { SignupPage } from '../signup/signup.page';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loading;
  credentials: Credentials;
  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  error = '';
  hidepassword = true;

  constructor(private menuCtrl: MenuController, private navCtrl: NavController, private authService: AuthService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) {
    this.credentials = new Credentials();
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.authService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }


  get f() {
    return this.loginForm.controls;
  }


  login() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

     this.loading = true;
    if (!environment.auth) {
      this.router.navigate([this.returnUrl]);
    } else {
      this.authService
        .login(this.f.username.value, this.f.password.value)
        .pipe(first())
        .subscribe(
          data => {
            this.router.navigate([this.returnUrl]);
          },
          error => {
            this.error = error;
            this.loading = false;
          }
        );
    }
  }

  fblogin() { }

  gplogin() { }

  signup() {
    this.navCtrl.navigateForward('signup');
  }
}
