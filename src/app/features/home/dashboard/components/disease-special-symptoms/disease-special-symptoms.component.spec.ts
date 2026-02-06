import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiseaseSpecialSymptomsComponent } from './disease-special-symptoms.component';

describe('DiseaseSpecialSymptomsComponent', () => {
  let component: DiseaseSpecialSymptomsComponent;
  let fixture: ComponentFixture<DiseaseSpecialSymptomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiseaseSpecialSymptomsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiseaseSpecialSymptomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
