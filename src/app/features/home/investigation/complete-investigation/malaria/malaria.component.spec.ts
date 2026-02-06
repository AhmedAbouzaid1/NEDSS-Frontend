/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MalariaComponent } from './malaria.component';

describe('MalariaComponent', () => {
  let component: MalariaComponent;
  let fixture: ComponentFixture<MalariaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MalariaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MalariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
