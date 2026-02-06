import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparationsTeamComponent } from './preparations-team.component';

describe('PreparationsTeamComponent', () => {
  let component: PreparationsTeamComponent;
  let fixture: ComponentFixture<PreparationsTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreparationsTeamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreparationsTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
