import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmediateReportingReportComponent } from './immediate-reporting-report.component';

describe('ImmediateReportingReportComponent', () => {
  let component: ImmediateReportingReportComponent;
  let fixture: ComponentFixture<ImmediateReportingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImmediateReportingReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImmediateReportingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
