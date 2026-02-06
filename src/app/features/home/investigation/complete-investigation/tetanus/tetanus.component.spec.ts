/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TetanusComponent } from './tetanus.component';

describe('TetanusComponent', () => {
  let component: TetanusComponent;
  let fixture: ComponentFixture<TetanusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TetanusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TetanusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
