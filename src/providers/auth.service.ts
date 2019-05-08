import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DecriptEncript } from 'src/app/security/decriptencript';
import { environment } from 'src/environments/environment';
import jwt from 'jsonwebtoken';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Customer } from 'src/models/customer';
import { map, timeout } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  result: any;
  private currenTokenSubject: BehaviorSubject<any>;
  public currentToken: Observable<any>;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;


  constructor(private http: HttpClient, private decriptEncript: DecriptEncript) {
    this.currenTokenSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentToken'))
    );
    this.currentToken = this.currenTokenSubject.asObservable();

    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currenTokenValue(): any {
    return this.currenTokenSubject.value;
  }

  public get currenUserValue(): any {
    return this.currentUserSubject.value;
  }


  public isAuthenticated(): boolean {
    if (!environment.production) {
      return true;
    }

    const jwtHelper = new JwtHelperService();
    if (this.currenTokenSubject.value === undefined || this.currenTokenSubject.value === null) {
      return false;
    }
    if (jwtHelper.isTokenExpired(this.currenTokenSubject.value)) {
      return this.refreshToken();
    }
    return true;
  }

  refreshToken() {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    if (user === undefined || user === null) {
      this.cleanStorage();
      return false;
    } else {
      try {
        this.generateToken(user, this.decript(user.password));
        return true;
      } catch (error) {
        this.cleanStorage();
        return false;
      }
    }
  }

  signup(customer: Customer, resolve, reject) {
    if (customer._id === undefined) {
      this.add(customer, resolve, reject);
    } else {
      this.update(customer, resolve, reject);

    }
  }

  add(customer: Customer, resolve, reject) {
    this.http
      .post(environment.database.uri + `/customer/add`, customer)
      .subscribe(res => {
        resolve(res);
      },
        error => {
          reject(error);
        });
  }

  update(customer: Customer, resolve, reject) {
    this.http
      .put(environment.database.uri + `/customer/update/${customer._id}`, customer)
      .subscribe(res => {
        resolve(res);
      },
        error => {
          reject(error);
        });
  }

  signupFb(customer: Customer, resolve, reject) {
    this.addFb(customer, resolve, reject);
  }


  signupGP(customer: Customer, resolve, reject) {
    this.addGp(customer, resolve, reject);
  }

  addFb(customer: Customer, resolve, reject) {
    this.http
    .post(environment.database.uri + `/customer/addFb`, customer)
    .subscribe(res => {
      this.generateToken(res, this.decript(res['password']));
      resolve(res);
    },
    error => {
      reject(error);
    });
  }
  
  addGp(customer: Customer, resolve, reject) {
    this.http
      .post(`${environment.database.uri}/customer/addGp`, customer)
      .subscribe(res => {
        this.generateToken(res, this.decript(res['password']));
        resolve(res);
      },
        error => {
          reject(error);
        });
  }

  cleanStorage() {
    localStorage.removeItem('currentToken');
    localStorage.removeItem('currentUser');
    this.currenTokenSubject.next(null);
    this.currentUserSubject.next(null);
  }


  public logout() {
    if (!this.isAuthenticated()) {
      return;
    }
    this.cleanStorage();
  }

  public login(email: string, password: string) {
    return this.http
      .post<any>(`${environment.database.uri}/customer/authenticate`, {
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
        ), timeout(9000)
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
      localStorage.setItem('currentUser', JSON.stringify(customer));
      this.currenTokenSubject.next(customer.token);
      this.currentUserSubject.next(customer);
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
