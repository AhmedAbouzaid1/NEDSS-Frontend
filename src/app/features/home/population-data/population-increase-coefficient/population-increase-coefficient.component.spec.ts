/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PopulationIncreaseCoefficientComponent } from './population-increase-coefficient.component';

describe('PopulationIncreaseCoefficientComponent', () => {
  let component: PopulationIncreaseCoefficientComponent;
  let fixture: ComponentFixture<PopulationIncreaseCoefficientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopulationIncreaseCoefficientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopulationIncreaseCoefficientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
