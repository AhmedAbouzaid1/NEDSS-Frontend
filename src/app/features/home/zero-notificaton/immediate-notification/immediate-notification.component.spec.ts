import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmediateNotificationComponent } from './immediate-notification.component';

describe('ImmediateNotificationComponent', () => {
  let component: ImmediateNotificationComponent;
  let fixture: ComponentFixture<ImmediateNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImmediateNotificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImmediateNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
