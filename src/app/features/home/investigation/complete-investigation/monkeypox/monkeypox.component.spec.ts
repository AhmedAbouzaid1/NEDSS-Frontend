/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MonkeypoxComponent } from './monkeypox.component';

describe('MonkeypoxComponent', () => {
  let component: MonkeypoxComponent;
  let fixture: ComponentFixture<MonkeypoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonkeypoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonkeypoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
