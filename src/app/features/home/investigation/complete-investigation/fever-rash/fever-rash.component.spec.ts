/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FeverRashComponent } from './fever-rash.component';

describe('FeverRashComponent', () => {
  let component: FeverRashComponent;
  let fixture: ComponentFixture<FeverRashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeverRashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeverRashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
