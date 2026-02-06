import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalSymptomsComponent } from './clinical-symptoms.component';

describe('ClinicalSymptomsComponent', () => {
  let component: ClinicalSymptomsComponent;
  let fixture: ComponentFixture<ClinicalSymptomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicalSymptomsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinicalSymptomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
