import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeColorsComponent } from './change-colors.component';

describe('ChangeColorsComponent', () => {
  let component: ChangeColorsComponent;
  let fixture: ComponentFixture<ChangeColorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeColorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
