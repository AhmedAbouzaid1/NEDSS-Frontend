import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcuteFlaccidParalysisComponent } from './acute-flaccid-paralysis.component';

describe('AcuteFlaccidParalysisComponent', () => {
  let component: AcuteFlaccidParalysisComponent;
  let fixture: ComponentFixture<AcuteFlaccidParalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcuteFlaccidParalysisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcuteFlaccidParalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
