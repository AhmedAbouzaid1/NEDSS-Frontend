import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopulationsReportComponent } from './populations-report.component';

describe('PopulationsReportComponent', () => {
  let component: PopulationsReportComponent;
  let fixture: ComponentFixture<PopulationsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopulationsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopulationsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
