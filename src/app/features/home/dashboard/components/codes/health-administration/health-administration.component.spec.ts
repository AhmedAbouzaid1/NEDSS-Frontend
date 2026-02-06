import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthAdministrationComponent } from './health-administration.component';

describe('HealthAdministrationComponent', () => {
  let component: HealthAdministrationComponent;
  let fixture: ComponentFixture<HealthAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HealthAdministrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
