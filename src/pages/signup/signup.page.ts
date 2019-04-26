import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/models/customer';
import { Location } from 'src/models/location';
import { CepService } from 'src/providers/cep.service';
import { MenuController, ToastController } from '@ionic/angular';
import { Toast } from 'src/app/toast/toast';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/providers/auth.service';
import { CPFValidator } from 'src/validations/valid-cpf.validator';
import { ConfirmPasswordValidator } from 'src/validations/confirm-password.validator';
import { Mask } from 'src/util/mask';
import { Router } from '@angular/router';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  customer: Customer;
  islogged;
  confirmPassword: string;
  materials;
  genders;
  loadingCep;
  toast: Toast;
  messageCode: any;
  isValidPasswordUser: boolean;
  passwordUser: string;
  isValidCPF: boolean;
  changedPassword;



  constructor(private router: Router, private cepService: CepService, private menuCtrl: MenuController, private http: HttpClient, private toastController: ToastController, private authService: AuthService) {
    this.customer = new Customer();
    this.customer.location = new Location();
    this.islogged = false;
    this.materials = Object.values(Customer.Material);
    this.genders = Object.values(Customer.Gender);
    this.loadingCep = false;
    this.toast = new Toast();
    this.http.get("./../assets/data/message.json").subscribe(response => this.loadMessages(response));
    this.passwordUser = undefined;
  }



  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.customer = JSON.parse(localStorage.getItem('currentUser'));
      this.passwordUser = this.authService.decript(this.customer.password);
      this.confirmPassword = this.authService.decript(this.customer.password);
      this.changedPassword = false;
      this.islogged = true;
      if (this.customer.location === undefined) {
        this.customer.location = new Location();
      }
    } else {
      this.menuCtrl.enable(false);
    }
  }
  loadMessages(response) {
    this.messageCode = response;
  }


  CEPSearch() {
    if (this.customer.location.cep === undefined || this.customer.location.cep === '') {
      return;
    }
    this.loadingCep = true;
    this.cepService.search(this.customer.location.cep).subscribe(result => {
      this.loadAddress(result);
      this.customer.location.cep = Mask.mask('cep', this.customer.location.cep);
    },
      error => {
        this.customer.location = new Location();
        this.errorCep();
      }
    );
    this.loadingCep = false;
  }
  errorCep() {
    this.showToast(this.messageCode['WARNNING']['WRE002']['summary'], 'warning', 3000);
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

  loadAddress(result) {
    if (result === undefined || result === null) {
      this.customer.location = new Location();
    }
    if (result.erro !== undefined && result.erro === true) {
      this.errorCep();
      return;
    }
    this.customer.location.cep = result.cep;
    this.customer.location.publicPlace = result.logradouro;
    this.customer.location.complement = result.complemento;
    this.customer.location.neighborhood = result.bairro;
    this.customer.location.county = result.localidade;
    this.customer.location.state = result.uf;
  }

  checkCPF() {
    if (this.customer.cpf === undefined || this.customer.cpf === '') {
      return;
    }
    this.isValidCPF = CPFValidator.MatchCNPJ(this.customer.cpf);
    if (!this.isValidCPF) {
      this.showToast(this.messageCode['WARNNING']['WRE003']['summary'], 'warning', 3000);
    } else {
      this.customer.cpf = Mask.mask('cpf', this.customer.cpf);
    }
  }


  comparePassword() {
    if (this.passwordUser === undefined || this.passwordUser === '' || (this.confirmPassword === undefined && this.confirmPassword === '')) {
      return;
    }
    if (this.passwordUser === undefined || this.passwordUser === '' || this.confirmPassword === undefined || this.confirmPassword === '') {
      this.isValidPasswordUser = false;
      return;
    }
    if (this.passwordUser.length < 6 || this.confirmPassword.length < 6) {
      this.showToast(this.messageCode['WARNNING']['WRE005']['summary'], 'warning', 3000);
      return;
    }
    this.customer.password = this.passwordUser;
    this.customer.password = this.authService.encript(this.customer.password);
    this.confirmPassword = this.authService.encript(this.confirmPassword);

    this.isValidPasswordUser = ConfirmPasswordValidator.MatchPassword(this.customer.password, this.confirmPassword);
    if (this.isValidPasswordUser) {
      this.confirmPassword = this.passwordUser;
    } else {
      this.confirmPassword = this.authService.decript(this.confirmPassword);
      this.showToast(this.messageCode['WARNNING']['WRE004']['summary'], 'warning', 3000);
    }
    if (this.customer._id !== undefined) {
      this.changedPassword = true;
    }
  }

  verifyBeforeSave() {
    if (this.customer.name === undefined
      || this.customer.password === undefined
      || this.customer.email === undefined
      || this.customer.creationDate === undefined) {
      this.showToast(this.messageCode['WARNNING']['WRE001']['summary'], 'warning', 3000);
      throw new Error();
    }

    if (this.islogged) {
      if (this.customer.location === undefined || this.customer.location.cep === undefined
        || this.customer.location.cep === undefined
        || this.customer.location.county === undefined
        || this.customer.location.neighborhood === undefined
        || this.customer.location.number <= 0
        || this.customer.location.publicPlace === undefined
        || this.customer.location.state === undefined
        || this.customer.location.complement === undefined
        || this.customer.sex === undefined
        || this.customer.birthday === undefined
        || this.customer.materials === undefined
      ) {
        this.showToast(this.messageCode['WARNNING']['WRE001']['summary'], 'warning', 3000);
        throw new Error();
      }
      let valid = CPFValidator.MatchCNPJ(this.customer.cpf);
      if (!valid) {
        this.showToast(this.messageCode['WARNNING']['WRE003']['summary'], 'warning', 3000);
        throw new Error();
      }
      if (this.passwordUser !== this.confirmPassword) {
        this.showToast(this.messageCode['WARNNING']['WRE004']['summary'], 'warning', 3000);
        throw new Error();
      }
    }
  }

  clean() {
    this.customer = new Customer();
    this.customer.location = new Location();
    this.passwordUser = undefined;
    this.confirmPassword = undefined;
  }

  async signup() {
    try {
      let isUpdate = false;
      if (!this.islogged) {
        this.customer.creationDate = new Date();
      } else {
        isUpdate = true;
        if (this.customer._id !== undefined && !this.changedPassword) {
          this.comparePassword();
        }
      }
      this.verifyBeforeSave();

      let promise = await new Promise((resolve, reject) => {
        this.authService.signup(this.customer, resolve, reject);
      });
      this.showToast(this.messageCode['SUCCESS']['SRE001']['summary'], 'success', 3000);
      this.finishSignUp(promise, isUpdate);
    } catch (error) {
      this.showToast(this.messageCode['WARNNING'][error]['summary'], 'warning', 3000);
    }
  }

  finishSignUp(promise, isUpdate) {
    localStorage.setItem('currentUser', JSON.stringify(promise));
    if (isUpdate) {
      return;
    }
    this.authService.refreshToken();
    this.menuCtrl.enable(true);
    this.router.navigate(['/home']);
  }



}
