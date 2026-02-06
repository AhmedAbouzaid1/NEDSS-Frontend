/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WithJobTitleReportComponent } from './withJobTitleReport.component';

describe('WithJobTitleReportComponent', () => {
  let component: WithJobTitleReportComponent;
  let fixture: ComponentFixture<WithJobTitleReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithJobTitleReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithJobTitleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
