import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SevereFoodPoisoningComponent } from './severe-food-poisoning.component';

describe('SevereFoodPoisoningComponent', () => {
  let component: SevereFoodPoisoningComponent;
  let fixture: ComponentFixture<SevereFoodPoisoningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SevereFoodPoisoningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SevereFoodPoisoningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
