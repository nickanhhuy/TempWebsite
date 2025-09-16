import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private apiUrl = '/api/sensors';
  http: HttpClient;
  constructor(http: HttpClient) {
    this.http = http;
  }

  getSensors(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  getSensorById(sensor_id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${sensor_id}`);
  }
  getSensorType(sensor_type: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/type/${sensor_type}`);
  }
  addSensor(sensor: any): Observable<any> {
    return this.http.post(this.apiUrl, sensor);
  }
  searchCity(city: string): Observable<any> {
    return this.http.get(`/api/search?city=${city}`);
  }
}
