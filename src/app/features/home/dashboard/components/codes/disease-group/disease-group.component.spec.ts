import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiseaseGroupComponent } from './disease-group.component';

describe('DiseaseGroupComponent', () => {
  let component: DiseaseGroupComponent;
  let fixture: ComponentFixture<DiseaseGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiseaseGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiseaseGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
