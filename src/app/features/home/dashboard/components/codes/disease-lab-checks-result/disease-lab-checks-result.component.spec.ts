import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiseaseLabChecksResultComponent } from './disease-lab-checks-result.component';

describe('DiseaseLabChecksResultComponent', () => {
  let component: DiseaseLabChecksResultComponent;
  let fixture: ComponentFixture<DiseaseLabChecksResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiseaseLabChecksResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiseaseLabChecksResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
