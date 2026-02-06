import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodOfCardsComponent } from './period-of-cards.component';

describe('PeriodOfCardsComponent', () => {
  let component: PeriodOfCardsComponent;
  let fixture: ComponentFixture<PeriodOfCardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PeriodOfCardsComponent]
    });
    fixture = TestBed.createComponent(PeriodOfCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
