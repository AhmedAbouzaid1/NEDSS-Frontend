import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentSourceComponent } from './incident-source.component';

describe('IncidentSourceComponent', () => {
  let component: IncidentSourceComponent;
  let fixture: ComponentFixture<IncidentSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentSourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
