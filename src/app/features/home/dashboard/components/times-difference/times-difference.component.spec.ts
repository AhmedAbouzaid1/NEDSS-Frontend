import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesDifferenceComponent } from './times-difference.component';

describe('TimesDifferenceComponent', () => {
  let component: TimesDifferenceComponent;
  let fixture: ComponentFixture<TimesDifferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimesDifferenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimesDifferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
