import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeperComponent } from './leper.component';

describe('LeperComponent', () => {
  let component: LeperComponent;
  let fixture: ComponentFixture<LeperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
