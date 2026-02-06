import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotInferringReportPdfComponent } from './not-inferring-report-pdf.component';

describe('NotInferringReportPdfComponent', () => {
  let component: NotInferringReportPdfComponent;
  let fixture: ComponentFixture<NotInferringReportPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotInferringReportPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotInferringReportPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
