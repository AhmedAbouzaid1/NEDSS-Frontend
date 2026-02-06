/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FinalResultToDiseasesComponent } from './finalResultToDiseases.component';

describe('FinalResultToDiseasesComponent', () => {
  let component: FinalResultToDiseasesComponent;
  let fixture: ComponentFixture<FinalResultToDiseasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalResultToDiseasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalResultToDiseasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
