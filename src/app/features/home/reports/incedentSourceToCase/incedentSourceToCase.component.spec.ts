/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IncedentSourceToCaseComponent } from './incedentSourceToCase.component';

describe('IncedentSourceToCaseComponent', () => {
  let component: IncedentSourceToCaseComponent;
  let fixture: ComponentFixture<IncedentSourceToCaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncedentSourceToCaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncedentSourceToCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
