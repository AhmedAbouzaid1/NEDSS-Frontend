import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesReportComponent } from './roles-report.component';

describe('RolesReportComponent', () => {
  let component: RolesReportComponent;
  let fixture: ComponentFixture<RolesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
