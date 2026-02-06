import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLabPatientComponent } from './add-lab-patient.component';

describe('AddLabPatientComponent', () => {
  let component: AddLabPatientComponent;
  let fixture: ComponentFixture<AddLabPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLabPatientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLabPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
