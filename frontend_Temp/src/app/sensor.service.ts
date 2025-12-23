import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  // Your Azure API URL
  private apiUrl = 'https://temperature-api-fpbraua4ckb7gmhu.canadacentral-01.azurewebsites.net/api';
  http: HttpClient;
  constructor(http: HttpClient) {
    this.http = http;
  }

  getSensors(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sensors`);
  }
  getSensorById(sensor_id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/sensors/${sensor_id}`);
  }
  getSensorType(sensor_type: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/sensors/type/${sensor_type}`);
  }
  addSensor(sensor: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/sensors`, sensor);
  }
  searchCity(city: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search?city=${city}`);
  }
}
