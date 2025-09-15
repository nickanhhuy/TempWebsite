import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensorService } from '../sensor.service';

@Component({
  standalone: true,
  selector: 'app-dashboard-sensor',
  imports: [CommonModule],
  templateUrl: './dashboard-sensor.component.html',
  styleUrls: ['./dashboard-sensor.component.css']
})
export class DashboardSensorComponent {
  sensors: any[] = [];

  constructor(private sensorService: SensorService) {}

  loadSensors() {
    this.sensorService.getSensors().subscribe({
      next: (data) => this.sensors = Object.values(data),
      error: (err) => console.error('Error fetching sensors:', err)
    });
  }
}

