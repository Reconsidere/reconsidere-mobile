import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/models/customer';

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

  constructor() {
    this.customer = new Customer();
    this.islogged = false;
    this.materials = Object.values(Customer.Material);
    this.genders = Object.values(Customer.Gender);
  }

  ngOnInit() {
    //[TODO: Vinicius]se ja estiver logado e tiver o token pegar os dados do usuário pelo id.
  }

}
