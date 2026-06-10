/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FasciolaComponent } from './fasciola.component';

describe('FasciolaComponent', () => {
  let component: FasciolaComponent;
  let fixture: ComponentFixture<FasciolaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FasciolaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FasciolaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
