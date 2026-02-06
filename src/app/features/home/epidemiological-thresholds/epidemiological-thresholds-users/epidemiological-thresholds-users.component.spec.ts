import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpidemiologicalThresholdsUsersComponent } from './epidemiological-thresholds-users.component';

describe('EpidemiologicalThresholdsUsersComponent', () => {
  let component: EpidemiologicalThresholdsUsersComponent;
  let fixture: ComponentFixture<EpidemiologicalThresholdsUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpidemiologicalThresholdsUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpidemiologicalThresholdsUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
