import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MersComponent } from './mers.component';

describe('MersComponent', () => {
  let component: MersComponent;
  let fixture: ComponentFixture<MersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
