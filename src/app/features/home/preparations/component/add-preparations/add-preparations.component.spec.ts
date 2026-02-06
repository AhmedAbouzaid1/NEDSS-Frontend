import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPreparationsComponent } from './add-preparations.component';

describe('AddPreparationsComponent', () => {
  let component: AddPreparationsComponent;
  let fixture: ComponentFixture<AddPreparationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPreparationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPreparationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
