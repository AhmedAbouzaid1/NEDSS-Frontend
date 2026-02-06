/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HemorrhagicFeversComponent } from './hemorrhagic-fevers.component';

describe('HemorrhagicFeversComponent', () => {
  let component: HemorrhagicFeversComponent;
  let fixture: ComponentFixture<HemorrhagicFeversComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HemorrhagicFeversComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HemorrhagicFeversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
