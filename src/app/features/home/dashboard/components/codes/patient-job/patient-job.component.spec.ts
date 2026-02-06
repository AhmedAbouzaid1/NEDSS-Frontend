import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientJobComponent } from './patient-job.component';

describe('PatientJobComponent', () => {
  let component: PatientJobComponent;
  let fixture: ComponentFixture<PatientJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientJobComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
