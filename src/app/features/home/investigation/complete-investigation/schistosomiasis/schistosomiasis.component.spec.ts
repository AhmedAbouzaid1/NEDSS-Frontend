/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SchistosomiasisComponent } from './schistosomiasis.component';

describe('SchistosomiasisComponent', () => {
  let component: SchistosomiasisComponent;
  let fixture: ComponentFixture<SchistosomiasisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchistosomiasisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchistosomiasisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
