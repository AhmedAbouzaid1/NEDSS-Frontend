/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PrevalenceRateToDiseaseFinalComponent } from './PrevalenceRateToDiseaseFinal.component';

describe('PrevalenceRateToDiseaseFinalComponent', () => {
  let component: PrevalenceRateToDiseaseFinalComponent;
  let fixture: ComponentFixture<PrevalenceRateToDiseaseFinalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrevalenceRateToDiseaseFinalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrevalenceRateToDiseaseFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
