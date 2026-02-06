import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiseaseChecksComponent } from './disease-checks.component';

describe('DiseaseChecksComponent', () => {
  let component: DiseaseChecksComponent;
  let fixture: ComponentFixture<DiseaseChecksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiseaseChecksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiseaseChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
