/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UsersReportComponent } from './usersReport.component';

describe('UsersReportComponent', () => {
  let component: UsersReportComponent;
  let fixture: ComponentFixture<UsersReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
