import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensorService } from '../sensor.service';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';

@Component({
  standalone: true,
  selector: 'app-dashboard-sensor',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-sensor.component.html',
  styleUrls: ['./dashboard-sensor.component.css']
})
export class DashboardSensorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  
  sensors: any[] = [];
  searchBar: string = '';
  selectedLocation: any = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  private map!: L.Map;
  private markers: L.Marker[] = [];
  private selectedMarker: L.Marker | null = null;

  constructor(private sensorService: SensorService) {}

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap() {
    // Initialize map centered on world view
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [20, 0],
      zoom: 2,
      zoomControl: true,
      attributionControl: false
    });

    // Use a balanced map style with clear labels
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(this.map);

    // Fix marker icon issue
    this.fixLeafletIconPath();
  }

  private fixLeafletIconPath() {
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

  private createCustomIcon(temperature: number, isSelected: boolean = false): L.DivIcon {
    let color = '#00bcd4';
    if (temperature > 30) color = '#ff1744';
    else if (temperature > 20) color = '#ff9800';
    else if (temperature > 10) color = '#ffc107';
    else if (temperature > 0) color = '#00bcd4';
    else color = '#2196f3';

    const size = isSelected ? 40 : 30;
    const pulseClass = isSelected ? 'pulse' : '';

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="marker-container ${pulseClass}">
          <div class="marker-pin" style="background: ${color}; width: ${size}px; height: ${size}px;">
            <div class="marker-inner">${Math.round(temperature)}°</div>
          </div>
          ${isSelected ? `<div class="marker-pulse" style="border-color: ${color};"></div>` : ''}
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size]
    });
  }

  private addMarker(lat: number, lon: number, location: any, isSelected: boolean = false) {
    const icon = this.createCustomIcon(location.value, isSelected);
    const marker = L.marker([lat, lon], { icon }).addTo(this.map);

    const popupContent = `
      <div class="custom-popup">
        <h3>${location.location}</h3>
        <div class="popup-temp">${location.value}°C</div>
        <div class="popup-coords">${lat.toFixed(2)}°, ${lon.toFixed(2)}°</div>
      </div>
    `;

    marker.bindPopup(popupContent);

    if (isSelected) {
      marker.openPopup();
      this.selectedMarker = marker;
    }

    this.markers.push(marker);
    return marker;
  }

  private clearMarkers() {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
    this.selectedMarker = null;
  }

  focusOnLocation(location: any) {
    this.selectedLocation = location;
    this.errorMessage = '';
    
    this.clearMarkers();
    this.addMarker(location.latitude, location.longitude, location, true);
    
    // Fly to location with smooth animation
    this.map.flyTo([location.latitude, location.longitude], 10, {
      duration: 2,
      easeLinearity: 0.25
    });
  }

  loadSensors() {
    this.errorMessage = '';
    this.sensorService.getSensors().subscribe({
      next: (data) => {
        this.sensors = Object.values(data);
        this.clearMarkers();
        
        this.sensors.forEach(sensor => {
          this.addMarker(sensor.latitude, sensor.longitude, sensor, false);
        });

        // Fit map to show all markers
        if (this.markers.length > 0) {
          const group = L.featureGroup(this.markers);
          this.map.fitBounds(group.getBounds().pad(0.1));
        }
      },
      error: (err) => {
        console.error('Error fetching sensors:', err);
        this.errorMessage = 'Failed to load sensors. Please try again.';
      }
    });
  }

  searchCity() {
    const searchTerm = this.searchBar.trim();
    
    if (!searchTerm) {
      this.errorMessage = 'Please enter a city name';
      return;
    }

    if (searchTerm.length < 2) {
      this.errorMessage = 'City name must be at least 2 characters';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    this.sensorService.searchCity(searchTerm).subscribe({
      next: (data: any) => {
        this.isLoading = false;
        this.sensors = [data];
        this.focusOnLocation(data);
        this.searchBar = '';
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error searching city:', err);
        
        if (err.status === 404) {
          this.errorMessage = `City "${searchTerm}" not found. Please check the spelling and try again.`;
        } else if (err.status === 400) {
          this.errorMessage = 'Invalid city name. Please enter a valid location.';
        } else if (err.status === 0) {
          this.errorMessage = 'Network error. Please check your connection.';
        } else {
          this.errorMessage = 'Unable to find location. Please try a different city name.';
        }
        
        this.searchBar = '';
      }
    });
  }

  resetView() {
    this.selectedLocation = null;
    this.errorMessage = '';
    this.clearMarkers();
    this.map.setView([20, 0], 2);
  }

  clearError() {
    this.errorMessage = '';
  }
}
