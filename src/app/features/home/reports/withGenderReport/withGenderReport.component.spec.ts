/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WithGenderReportComponent } from './withGenderReport.component';

describe('WithGenderReportComponent', () => {
  let component: WithGenderReportComponent;
  let fixture: ComponentFixture<WithGenderReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithGenderReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithGenderReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
