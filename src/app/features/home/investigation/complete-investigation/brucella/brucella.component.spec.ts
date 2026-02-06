import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrucellaComponent } from './brucella.component';

describe('BrucellaComponent', () => {
  let component: BrucellaComponent;
  let fixture: ComponentFixture<BrucellaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrucellaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrucellaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
