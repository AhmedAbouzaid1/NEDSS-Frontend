import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationQuestionsComponent } from './evaluation-questions.component';

describe('EvaluationQuestionsComponent', () => {
  let component: EvaluationQuestionsComponent;
  let fixture: ComponentFixture<EvaluationQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationQuestionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
