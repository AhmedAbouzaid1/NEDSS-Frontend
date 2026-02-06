import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientChecksComponent } from './patient-checks.component';

describe('PatientChecksComponent', () => {
  let component: PatientChecksComponent;
  let fixture: ComponentFixture<PatientChecksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientChecksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
