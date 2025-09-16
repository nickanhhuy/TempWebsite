import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensorService } from '../sensor.service';
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  selector: 'app-dashboard-sensor',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-sensor.component.html',
  styleUrls: ['./dashboard-sensor.component.css']
})
export class DashboardSensorComponent {
  sensors: any[] = [];
  searchBar: string = '';
  constructor(private sensorService: SensorService) {}

  loadSensors() {
    this.sensorService.getSensors().subscribe({
      next: (data) => this.sensors = Object.values(data),
      error: (err) => console.error('Error fetching sensors:', err)
    });
  }
  searchCity() {
    if (!this.searchBar.trim()) return;

    this.sensorService.searchCity(this.searchBar).subscribe({
      next: (data: any) => {
        this.sensors = [data];
        console.log('Search result:', data);
      },
      error: (err) => console.error('Error searching city:', err)
    });
  }

}

