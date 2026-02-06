import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabCasesComponent } from './lab-cases.component';

describe('LabCasesComponent', () => {
  let component: LabCasesComponent;
  let fixture: ComponentFixture<LabCasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabCasesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
