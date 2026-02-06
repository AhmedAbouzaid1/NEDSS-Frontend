/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DiphtheriaComponent } from './diphtheria.component';

describe('DiphtheriaComponent', () => {
  let component: DiphtheriaComponent;
  let fixture: ComponentFixture<DiphtheriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiphtheriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiphtheriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
