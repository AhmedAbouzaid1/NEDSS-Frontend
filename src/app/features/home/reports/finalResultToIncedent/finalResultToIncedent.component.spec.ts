/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FinalResultToIncedentComponent } from './finalResultToIncedent.component';

describe('FinalResultToIncedentComponent', () => {
  let component: FinalResultToIncedentComponent;
  let fixture: ComponentFixture<FinalResultToIncedentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalResultToIncedentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalResultToIncedentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
