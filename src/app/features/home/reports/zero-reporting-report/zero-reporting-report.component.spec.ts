import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZeroReportingReportComponent } from './zero-reporting-report.component';

describe('ZeroReportingReportComponent', () => {
  let component: ZeroReportingReportComponent;
  let fixture: ComponentFixture<ZeroReportingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZeroReportingReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZeroReportingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
