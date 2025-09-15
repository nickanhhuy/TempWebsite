import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardSensorComponent } from './dashboard-sensor/dashboard-sensor.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DashboardSensorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend_Temp';
}
