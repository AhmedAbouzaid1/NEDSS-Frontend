import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotInferringReportComponent } from './not-inferring-report.component';

describe('NotInferringReportComponent', () => {
  let component: NotInferringReportComponent;
  let fixture: ComponentFixture<NotInferringReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotInferringReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotInferringReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
