import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralDataCompletionComponent } from './general-data-completion.component';

describe('GeneralDataCompletionComponent', () => {
  let component: GeneralDataCompletionComponent;
  let fixture: ComponentFixture<GeneralDataCompletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralDataCompletionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralDataCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
