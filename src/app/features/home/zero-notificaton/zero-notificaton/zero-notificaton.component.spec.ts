import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZeroNotificatonComponent } from './zero-notificaton.component';

describe('ZeroNotificatonComponent', () => {
  let component: ZeroNotificatonComponent;
  let fixture: ComponentFixture<ZeroNotificatonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZeroNotificatonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZeroNotificatonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
