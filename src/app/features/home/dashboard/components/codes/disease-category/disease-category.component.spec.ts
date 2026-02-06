import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiseaseCategoryComponent } from './disease-category.component';

describe('DiseaseCategoryComponent', () => {
  let component: DiseaseCategoryComponent;
  let fixture: ComponentFixture<DiseaseCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiseaseCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiseaseCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
