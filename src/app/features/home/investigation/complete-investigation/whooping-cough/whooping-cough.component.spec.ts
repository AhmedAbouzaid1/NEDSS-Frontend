/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WhoopingCoughComponent } from './whooping-cough.component';

describe('WhoopingCoughComponent', () => {
  let component: WhoopingCoughComponent;
  let fixture: ComponentFixture<WhoopingCoughComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhoopingCoughComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoopingCoughComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
