/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IncidentSourceToDepartmentReportComponent } from './incident-source-to-department-report.component';

describe('IncidentSourceToDepartmentReportComponent', () => {
  let component: IncidentSourceToDepartmentReportComponent;
  let fixture: ComponentFixture<IncidentSourceToDepartmentReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncidentSourceToDepartmentReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentSourceToDepartmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
