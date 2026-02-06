/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EpidemiologicalThresholdsComponent } from './epidemiological-thresholds.component';

describe('EpidemiologicalThresholdsComponent', () => {
  let component: EpidemiologicalThresholdsComponent;
  let fixture: ComponentFixture<EpidemiologicalThresholdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpidemiologicalThresholdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpidemiologicalThresholdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
