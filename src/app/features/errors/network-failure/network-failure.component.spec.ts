import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkFailureComponent } from './network-failure.component';

describe('NetworkFailureComponent', () => {
  let component: NetworkFailureComponent;
  let fixture: ComponentFixture<NetworkFailureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetworkFailureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
