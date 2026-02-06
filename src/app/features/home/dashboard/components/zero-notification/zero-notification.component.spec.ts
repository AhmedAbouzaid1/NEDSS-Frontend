import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZeroNotificationComponent } from './zero-notification.component';

describe('TimesDifferenceComponent', () => {
  let component: ZeroNotificationComponent;
  let fixture: ComponentFixture<ZeroNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ZeroNotificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZeroNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
