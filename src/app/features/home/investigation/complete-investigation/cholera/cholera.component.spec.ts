import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CholeraComponent } from './cholera.component';

describe('CholeraComponent', () => {
  let component: CholeraComponent;
  let fixture: ComponentFixture<CholeraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CholeraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CholeraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
