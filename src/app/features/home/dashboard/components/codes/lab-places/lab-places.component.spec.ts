import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabPlacesComponent } from './lab-places.component';

describe('LabPlacesComponent', () => {
  let component: LabPlacesComponent;
  let fixture: ComponentFixture<LabPlacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabPlacesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabPlacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
