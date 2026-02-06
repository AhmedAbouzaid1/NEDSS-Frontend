import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeishmaniaComponent } from './leishmania.component';

describe('LeishmaniaComponent', () => {
  let component: LeishmaniaComponent;
  let fixture: ComponentFixture<LeishmaniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeishmaniaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeishmaniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
