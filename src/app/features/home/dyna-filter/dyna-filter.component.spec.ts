import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynaFilterComponent } from './dyna-filter.component';

describe('DynaFilterComponent', () => {
  let component: DynaFilterComponent;
  let fixture: ComponentFixture<DynaFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynaFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynaFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
