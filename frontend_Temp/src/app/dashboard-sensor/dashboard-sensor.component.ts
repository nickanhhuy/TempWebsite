import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
@Component({
  standalone: true,
  selector: 'app-dashboard-sensor',
  imports: [CommonModule],
  templateUrl: './dashboard-sensor.component.html',
  styleUrl: './dashboard-sensor.component.css'
})
export class DashboardSensorComponent {
  sensors: any[] = [];
  http: HttpClient;
 constructor(http: HttpClient) {
    this.http = http;
  }

  loadSensors() {
    this.http.get<any>('/api/sensors')
      .subscribe(data => {
        this.sensors = Object.values(data);
      },error => {
        console.error('Error fetching sensors:', error);
      });
      
  }
}
