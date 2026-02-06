import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopulationsReportPDFComponent } from './populations-report-pdf.component';

describe('PopulationsReportPDFComponent', () => {
  let component: PopulationsReportPDFComponent;
  let fixture: ComponentFixture<PopulationsReportPDFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopulationsReportPDFComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopulationsReportPDFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
