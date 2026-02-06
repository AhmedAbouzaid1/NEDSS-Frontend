import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparationsDevicesComponent } from './preparations-devices.component';

describe('PreparationsDevicesComponent', () => {
  let component: PreparationsDevicesComponent;
  let fixture: ComponentFixture<PreparationsDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreparationsDevicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreparationsDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
