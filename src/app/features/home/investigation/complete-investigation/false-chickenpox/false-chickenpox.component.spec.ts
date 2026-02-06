import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FalseChickenpoxComponent } from './false-chickenpox.component';

describe('FalseChickenpoxComponent', () => {
  let component: FalseChickenpoxComponent;
  let fixture: ComponentFixture<FalseChickenpoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FalseChickenpoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FalseChickenpoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
