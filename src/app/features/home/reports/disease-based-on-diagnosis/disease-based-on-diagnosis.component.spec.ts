import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiseaseBasedOnDiagnosisComponent } from './disease-based-on-diagnosis.component';

describe('DiseaseBasedOnDiagnosisComponent', () => {
  let component: DiseaseBasedOnDiagnosisComponent;
  let fixture: ComponentFixture<DiseaseBasedOnDiagnosisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiseaseBasedOnDiagnosisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiseaseBasedOnDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
