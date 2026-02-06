/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PrevalenceRateToDiseaseReportComponent } from './PrevalenceRateToDiseaseReport.component';

describe('PrevalenceRateToDiseaseReportComponent', () => {
  let component: PrevalenceRateToDiseaseReportComponent;
  let fixture: ComponentFixture<PrevalenceRateToDiseaseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrevalenceRateToDiseaseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrevalenceRateToDiseaseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
