import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UncompletedInvestigationsComponent } from './uncompleted-investigations.component';

describe('ReportedCasesComponent', () => {
  let component: UncompletedInvestigationsComponent;
  let fixture: ComponentFixture<UncompletedInvestigationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UncompletedInvestigationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UncompletedInvestigationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
