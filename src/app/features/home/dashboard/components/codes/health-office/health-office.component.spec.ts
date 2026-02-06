import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthOfficeComponent } from './health-office.component';

describe('HealthOfficeComponent', () => {
  let component: HealthOfficeComponent;
  let fixture: ComponentFixture<HealthOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HealthOfficeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
