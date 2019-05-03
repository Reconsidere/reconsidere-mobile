import { Component, OnInit } from '@angular/core';
import { Credentials } from 'src/models/credentials';
import { MenuController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/providers/auth.service';
import { SignupPage } from '../signup/signup.page';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { first } from 'rxjs/operators';
import { Toast } from 'src/app/toast/toast';
import { HttpClient } from '@angular/common/http';

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
  toast: Toast;
  messageCode: any;

  constructor(private http: HttpClient, private toastController: ToastController, private menuCtrl: MenuController, private navCtrl: NavController, private authService: AuthService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) {
    this.credentials = new Credentials();
    this.menuCtrl.enable(false);
    this.http.get("./../assets/data/message.json").subscribe(response => this.loadMessages(response));

  }

  
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.authService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  async showToast(message: string, color: string, time: number) {
    const toast = await this.toastController.create({
      message: message,
      showCloseButton: true,
      position: 'top',
      closeButtonText: 'Fechar',
      color: color,
      duration: time,
      animated: true
    });
    toast.present();
  }

  loadMessages(response) {
    this.messageCode = response;
  }


  get f() {
    return this.loginForm.controls;
  }


  login() {
    try {
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
              this.menuCtrl.enable(true);
              this.router.navigate([this.returnUrl]);
            },
            error => {
              this.error = error;
              this.loading = false;
              try {
                this.showToast(this.messageCode['ERROR'][error]['summary'], 'danger', 5000);
              } catch (error) {
                this.showToast(this.messageCode['ERROR']['ERE009']['summary'], 'danger', 5000);
              }

            }
          );
      }
    } catch (error) {
      try {
        this.showToast(this.messageCode['ERROR'][error]['summary'], 'danger', 5000);
      } catch (error) {
        this.showToast(this.messageCode['ERROR']['ERE009']['summary'], 'danger', 5000);
      }
    }
  }

  fblogin() { }

  gplogin() { }

  signup() {
    this.router.navigate(['signup'])
  }
}
