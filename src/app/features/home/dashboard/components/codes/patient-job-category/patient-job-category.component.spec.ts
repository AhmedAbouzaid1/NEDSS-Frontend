import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientJobCategoryComponent } from './patient-job-category.component';

describe('PatientJobCategoryComponent', () => {
  let component: PatientJobCategoryComponent;
  let fixture: ComponentFixture<PatientJobCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientJobCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientJobCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
