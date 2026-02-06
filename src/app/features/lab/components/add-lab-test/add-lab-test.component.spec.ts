import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLabTestComponent } from './add-lab-test.component';

describe('AddLabTestComponent', () => {
  let component: AddLabTestComponent;
  let fixture: ComponentFixture<AddLabTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLabTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLabTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
