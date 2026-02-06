import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonInferenceCasesComponent } from './non-inference-cases.component';

describe('NonInferenceCasesComponent', () => {
  let component: NonInferenceCasesComponent;
  let fixture: ComponentFixture<NonInferenceCasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NonInferenceCasesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonInferenceCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
