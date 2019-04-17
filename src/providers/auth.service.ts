import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DecriptEncript } from 'src/app/security/decriptencript';
import { environment } from 'src/environments/environment';
import jwt from 'jsonwebtoken';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Customer } from 'src/models/customer';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  result: any;
  private currenTokenSubject: BehaviorSubject<any>;
  public currentToken: Observable<any>;


  constructor(private http: HttpClient, private decriptEncript: DecriptEncript) {
    this.currenTokenSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentToken'))
    );
    this.currentToken = this.currenTokenSubject.asObservable();
  }

  public get currenTokenValue(): any {
    return this.currenTokenSubject.value;
  }


   public isAuthenticated(): boolean {
    if (!environment.production) {
      return true;
    }

    const jwtHelper = new JwtHelperService();
    if (jwtHelper.isTokenExpired(this.currenTokenSubject.value)) {
      this.cleanStorage();
      return false;
    }
    return true;
  }


  add(customer: Customer) {
    this.http
      .post(environment.api.uri + `api/customer
      /add`, customer)
      .subscribe(res => console.log('Done'));
  }

  update(organizationId: string, customer: Customer) {
    this.http
      .put(
        environment.database.uri + `/customer
        /update/${customer._id}`,
        customer
      )
      .subscribe(res => console.log('Done'));
  }

  cleanStorage() {
    localStorage.removeItem('currentToken');
    this.currenTokenSubject.next(null);
  }

  
  public logout() {
    if (!this.isAuthenticated()) {
      return;
    }
    this.cleanStorage();
  }

  public login(email: string, password: string) {
    return this.http
      .post<any>(`${environment.database.uri}/customer/user/authenticate`, {
        email: email
      })
      .pipe(
        map(
          user => {
            const isLogged = this.generateToken(user, password);
            if (!isLogged) {
              throw new Error('ERE001');
            }
          },
          error => {
            throw new Error('ERE001');
          }
        )
      );
  }


  generateToken(customer, password): boolean {
    if (customer) {
      const decryptPass = this.decript(customer.password);
      if (password !== decryptPass) {
        return false;
      } else {
        const id = customer._id;
        customer.token = jwt.sign({ id }, environment.secret, {
          expiresIn: 3600 // uma hora
        });
      }
      localStorage.setItem('currentToken', JSON.stringify(customer.token));
      this.currenTokenSubject.next(customer.token);
      return true;
    }
  }

  encript(value) {
    return this.decriptEncript.set(environment.secret, value);
  }

  decript(value) {
    return this.decriptEncript.get(environment.secret, value);
  }

}
