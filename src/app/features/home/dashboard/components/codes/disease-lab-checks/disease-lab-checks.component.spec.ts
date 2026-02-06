import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiseaseLabChecksComponent } from './disease-lab-checks.component';

describe('DiseaseLabChecksComponent', () => {
  let component: DiseaseLabChecksComponent;
  let fixture: ComponentFixture<DiseaseLabChecksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiseaseLabChecksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiseaseLabChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
