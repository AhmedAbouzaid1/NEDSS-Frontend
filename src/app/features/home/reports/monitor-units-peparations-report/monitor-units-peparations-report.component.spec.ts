import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorUnitsPeparationsReportComponent } from './monitor-units-peparations-report.component';

describe('MonitorUnitsPeparationsReportComponent', () => {
  let component: MonitorUnitsPeparationsReportComponent;
  let fixture: ComponentFixture<MonitorUnitsPeparationsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorUnitsPeparationsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitorUnitsPeparationsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
