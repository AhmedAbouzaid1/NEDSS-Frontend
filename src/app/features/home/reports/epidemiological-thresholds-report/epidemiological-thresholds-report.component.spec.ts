import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpidemiologicalThresholdsReportComponent } from './epidemiological-thresholds-report.component';

describe('EpidemiologicalThresholdsReportComponent', () => {
  let component: EpidemiologicalThresholdsReportComponent;
  let fixture: ComponentFixture<EpidemiologicalThresholdsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpidemiologicalThresholdsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpidemiologicalThresholdsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
