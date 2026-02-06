import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotInferringComponent } from './not-inferring.component';

describe('NotInferringComponent', () => {
  let component: NotInferringComponent;
  let fixture: ComponentFixture<NotInferringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotInferringComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotInferringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
