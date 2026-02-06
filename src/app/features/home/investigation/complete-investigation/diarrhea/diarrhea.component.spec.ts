import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiarrheaComponent } from './diarrhea.component';

describe('DiarrheaComponent', () => {
  let component: DiarrheaComponent;
  let fixture: ComponentFixture<DiarrheaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiarrheaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiarrheaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
