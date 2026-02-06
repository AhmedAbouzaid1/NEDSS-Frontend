import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiseaseRulesComponent } from './disease-rules.component';

describe('DiseaseRulesComponent', () => {
  let component: DiseaseRulesComponent;
  let fixture: ComponentFixture<DiseaseRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiseaseRulesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiseaseRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
