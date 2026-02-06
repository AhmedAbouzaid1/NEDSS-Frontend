/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BuildControlComponent } from './build-control.component';

describe('BuildControlComponent', () => {
  let component: BuildControlComponent;
  let fixture: ComponentFixture<BuildControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
