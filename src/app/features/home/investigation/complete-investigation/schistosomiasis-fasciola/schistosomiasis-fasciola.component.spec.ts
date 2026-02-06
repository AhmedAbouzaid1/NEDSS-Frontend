/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SchistosomiasisFasciolaComponent } from './schistosomiasis-fasciola.component';

describe('SchistosomiasisFasciolaComponent', () => {
  let component: SchistosomiasisFasciolaComponent;
  let fixture: ComponentFixture<SchistosomiasisFasciolaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchistosomiasisFasciolaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchistosomiasisFasciolaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
