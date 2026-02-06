import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZeroReportingReportPdfComponent } from './zero-reporting-report-pdf.component';

describe('ZeroReportingReportPdfComponent', () => {
  let component: ZeroReportingReportPdfComponent;
  let fixture: ComponentFixture<ZeroReportingReportPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZeroReportingReportPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZeroReportingReportPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
