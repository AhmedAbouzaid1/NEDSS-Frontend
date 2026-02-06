import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiseaseSeverityComponent } from './disease-severity.component';

describe('DiseaseSeverityComponent', () => {
  let component: DiseaseSeverityComponent;
  let fixture: ComponentFixture<DiseaseSeverityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiseaseSeverityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiseaseSeverityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
