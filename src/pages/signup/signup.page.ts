import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/models/customer';
import { Location } from 'src/models/location';
import { CepService } from 'src/providers/cep.service';
import { MenuController, ToastController } from '@ionic/angular';
import { Toast } from 'src/app/toast/toast';
import { HttpClient } from '@angular/common/http';
//import * as data from '../../assets/data/message.json';
var messageCode = require('../../assets/data/message.json');


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
  messageCode;

  constructor(private cepService: CepService, private menuCtrl: MenuController, private http: HttpClient) {
    this.customer = new Customer();
    this.customer.location = new Location();
    this.islogged = false;
    this.materials = Object.values(Customer.Material);
    this.genders = Object.values(Customer.Gender);
    this.loadingCep = false;
    this.menuCtrl.enable(false);
    this.toast = new Toast();
  }

  loadMessages(res) {
    this.messageCode = res;
  }

  ngOnInit() {
    //[TODO: Vinicius]se ja estiver logado e tiver o token pegar os dados do usuário pelo id.
    //se tiver logado habilitar menu..
  }


  CEPSearch() {
    this.loadingCep = true;
    this.cepService.search(this.customer.location.cep).subscribe(result => {
      this.loadAddress(result);
    },
      error => {
        this.customer.location = new Location();
      }
    );
    this.loadingCep = false;
  }

  loadAddress(result) {
    if (result === undefined || result === null) {
      this.customer.location = new Location();
    }
    this.customer.location.cep = result.cep;
    this.customer.location.publicPlace = result.logradouro;
    this.customer.location.complement = result.complemento;
    this.customer.location.neighborhood = result.bairro;
    this.customer.location.county = result.localidade;
    this.customer.location.state = result.uf;
  }

  verifyBeforeSave() {
    if (this.customer.name === undefined || this.customer.password === undefined || this.customer.email === undefined) {
      this.toast.showToast(this.messageCode['WARNNING']['WRE001']['summary'], 'warning');
      throw new Error();
    }
  }

  signup() {
    try {

    } catch (error) {

    }

  }



}
