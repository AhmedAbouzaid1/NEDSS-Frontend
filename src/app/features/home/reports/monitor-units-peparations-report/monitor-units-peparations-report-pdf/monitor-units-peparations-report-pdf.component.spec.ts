import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorUnitsPeparationsReportPdfComponent } from './monitor-units-peparations-report-pdf.component';

describe('MonitorUnitsPeparationsReportPdfComponent', () => {
  let component: MonitorUnitsPeparationsReportPdfComponent;
  let fixture: ComponentFixture<MonitorUnitsPeparationsReportPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorUnitsPeparationsReportPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitorUnitsPeparationsReportPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
