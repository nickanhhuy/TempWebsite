import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSensorComponent } from './dashboard-sensor.component';

describe('DashboardSensorComponent', () => {
  let component: DashboardSensorComponent;
  let fixture: ComponentFixture<DashboardSensorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSensorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardSensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
