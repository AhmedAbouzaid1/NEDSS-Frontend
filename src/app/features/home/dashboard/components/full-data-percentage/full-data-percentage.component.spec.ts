import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullDataPercentageComponent } from './full-data-percentage.component';

describe('FullDataPercentageComponent', () => {
  let component: FullDataPercentageComponent;
  let fixture: ComponentFixture<FullDataPercentageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FullDataPercentageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullDataPercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
