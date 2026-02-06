import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZeroReportComponent } from './zero-report.component';

describe('ZeroReportComponent', () => {
  let component: ZeroReportComponent;
  let fixture: ComponentFixture<ZeroReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZeroReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZeroReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
