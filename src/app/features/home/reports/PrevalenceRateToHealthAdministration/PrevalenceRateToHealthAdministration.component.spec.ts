/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PrevalenceRateToHealthAdministrationComponent } from './PrevalenceRateToHealthAdministration.component';

describe('PrevalenceRateToHealthAdministrationComponent', () => {
  let component: PrevalenceRateToHealthAdministrationComponent;
  let fixture: ComponentFixture<PrevalenceRateToHealthAdministrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrevalenceRateToHealthAdministrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrevalenceRateToHealthAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
