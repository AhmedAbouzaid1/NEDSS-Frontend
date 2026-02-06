import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeningealComponent } from './meningeal.component';

describe('MeningealComponent', () => {
  let component: MeningealComponent;
  let fixture: ComponentFixture<MeningealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeningealComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeningealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
