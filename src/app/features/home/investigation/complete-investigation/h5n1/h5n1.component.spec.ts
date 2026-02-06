/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { H5n1Component } from './h5n1.component';

describe('H5n1Component', () => {
  let component: H5n1Component;
  let fixture: ComponentFixture<H5n1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ H5n1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(H5n1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
