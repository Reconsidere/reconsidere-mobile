import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NeighborhoodSchedulingService {

  constructor(private http: HttpClient) { }


  loadAll() {
    return this.http.get<any>(`${environment.database.uri}/organization/neighborhoodscheduling/app/all`);
  }


  loadScheduling(neighborhood) {
    return this.http.get<any>(`${environment.database.uri}/organization/neighborhoodscheduling/${neighborhood}`);
  }
}
