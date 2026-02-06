import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemographicDataComponent } from './demographic-data.component';

describe('DemographicDataComponent', () => {
  let component: DemographicDataComponent;
  let fixture: ComponentFixture<DemographicDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemographicDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemographicDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
