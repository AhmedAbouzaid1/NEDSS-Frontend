import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitNewReviewComponent } from './visit-new-review.component';

describe('VisitNewReviewComponent', () => {
  let component: VisitNewReviewComponent;
  let fixture: ComponentFixture<VisitNewReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitNewReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitNewReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
