import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalityComponent } from './principality.component';

describe('PrincipalityComponent', () => {
  let component: PrincipalityComponent;
  let fixture: ComponentFixture<PrincipalityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrincipalityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrincipalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
