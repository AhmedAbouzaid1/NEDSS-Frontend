import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitResponsibilityLevelComponent } from './unit-responsibility-level.component';

describe('UnitResponsibilityLevelComponent', () => {
  let component: UnitResponsibilityLevelComponent;
  let fixture: ComponentFixture<UnitResponsibilityLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitResponsibilityLevelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitResponsibilityLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
