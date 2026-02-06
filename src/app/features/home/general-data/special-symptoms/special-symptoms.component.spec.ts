import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialSymptomsComponent } from './special-symptoms.component';

describe('SpecialSymptomsComponent', () => {
  let component: SpecialSymptomsComponent;
  let fixture: ComponentFixture<SpecialSymptomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecialSymptomsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialSymptomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
