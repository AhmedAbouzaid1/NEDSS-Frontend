import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseResultCategoryComponent } from './case-result-category.component';

describe('CaseResultCategoryComponent', () => {
  let component: CaseResultCategoryComponent;
  let fixture: ComponentFixture<CaseResultCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseResultCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseResultCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
