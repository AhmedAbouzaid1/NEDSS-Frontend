/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PlagueComponent } from './plague.component';

describe('PlagueComponent', () => {
  let component: PlagueComponent;
  let fixture: ComponentFixture<PlagueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlagueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlagueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
