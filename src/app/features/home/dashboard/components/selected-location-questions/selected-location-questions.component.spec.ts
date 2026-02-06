import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedLocationQuestionsComponent } from './selected-location-questions.component';

describe('SelectedLocationQuestionsComponent', () => {
  let component: SelectedLocationQuestionsComponent;
  let fixture: ComponentFixture<SelectedLocationQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedLocationQuestionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedLocationQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
