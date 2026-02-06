/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PrevalenceRateToDeathReportComponent } from './PrevalenceRateToDeathReport.component';

describe('PrevalenceRateToDeathReportComponent', () => {
  let component: PrevalenceRateToDeathReportComponent;
  let fixture: ComponentFixture<PrevalenceRateToDeathReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrevalenceRateToDeathReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrevalenceRateToDeathReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
