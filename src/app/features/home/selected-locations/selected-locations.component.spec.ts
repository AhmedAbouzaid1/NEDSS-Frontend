import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedLocationsComponent } from './selected-locations.component';

describe('SelectedLocationsComponent', () => {
  let component: SelectedLocationsComponent;
  let fixture: ComponentFixture<SelectedLocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedLocationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
