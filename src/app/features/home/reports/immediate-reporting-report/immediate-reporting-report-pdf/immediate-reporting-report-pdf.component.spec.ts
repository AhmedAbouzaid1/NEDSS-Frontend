import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmediateReportingReportPdfComponent } from './immediate-reporting-report-pdf.component';

describe('ImmediateReportingReportPdfComponent', () => {
  let component: ImmediateReportingReportPdfComponent;
  let fixture: ComponentFixture<ImmediateReportingReportPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImmediateReportingReportPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImmediateReportingReportPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
