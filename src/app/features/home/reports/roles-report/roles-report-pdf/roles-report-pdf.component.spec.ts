import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesReportPdfComponent } from './roles-report-pdf.component';

describe('RolesReportPdfComponent', () => {
  let component: RolesReportPdfComponent;
  let fixture: ComponentFixture<RolesReportPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesReportPdfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesReportPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
