import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpidemiologicalThresholdsReportPdfComponent } from './epidemiological-thresholds-report-pdf.component';

describe('EpidemiologicalThresholdsReportPdfComponent', () => {
  let component: EpidemiologicalThresholdsReportPdfComponent;
  let fixture: ComponentFixture<EpidemiologicalThresholdsReportPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpidemiologicalThresholdsReportPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpidemiologicalThresholdsReportPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
