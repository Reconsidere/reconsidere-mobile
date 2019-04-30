import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from 'src/models/customer';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchedulingService {

  constructor(private http: HttpClient) { }


  save(customer: Customer, resolve, reject) {
    this.add(customer, resolve, reject);
  }

  add(customer: Customer, resolve, reject) {
    this.http
      .post(environment.database.uri + `/customer/scheduling/add/${customer._id}`, customer.scheduling)
      .subscribe(res => {
        resolve(res);
      },
        error => {
          reject(error);
        });
  }

  loadAll(id) {
    return this.http.get<any>(`${environment.database.uri}/customer/scheduling/all/${id}`);
  }
}
