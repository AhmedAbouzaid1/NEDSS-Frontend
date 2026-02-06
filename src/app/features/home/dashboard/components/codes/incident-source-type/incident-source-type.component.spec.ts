import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentSourceTypeComponent } from './incident-source-type.component';

describe('IncidentSourceTypeComponent', () => {
  let component: IncidentSourceTypeComponent;
  let fixture: ComponentFixture<IncidentSourceTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentSourceTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentSourceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
