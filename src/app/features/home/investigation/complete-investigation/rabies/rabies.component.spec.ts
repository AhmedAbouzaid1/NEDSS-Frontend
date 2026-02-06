/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RabiesComponent } from './rabies.component';

describe('RabiesComponent', () => {
  let component: RabiesComponent;
  let fixture: ComponentFixture<RabiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RabiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RabiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
