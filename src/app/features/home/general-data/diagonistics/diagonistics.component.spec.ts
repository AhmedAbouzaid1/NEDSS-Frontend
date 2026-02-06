import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagonisticsComponent } from './diagonistics.component';

describe('DiagonisticsComponent', () => {
  let component: DiagonisticsComponent;
  let fixture: ComponentFixture<DiagonisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiagonisticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagonisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
