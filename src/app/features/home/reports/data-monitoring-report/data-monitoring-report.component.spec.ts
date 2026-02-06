/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DataMonitoringReportComponent } from './data-monitoring-report.component';

describe('DataMonitoringReportComponent', () => {
  let component: DataMonitoringReportComponent;
  let fixture: ComponentFixture<DataMonitoringReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataMonitoringReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataMonitoringReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
