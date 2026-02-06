import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportedCasesComponent } from './reported-cases.component';

describe('ReportedCasesComponent', () => {
  let component: ReportedCasesComponent;
  let fixture: ComponentFixture<ReportedCasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportedCasesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportedCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
