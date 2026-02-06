/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { generalreportFormComponent } from './general-report-form.component';

describe('generalreportFormComponent', () => {
  let component: generalreportFormComponent;
  let fixture: ComponentFixture<generalreportFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ generalreportFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(generalreportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
