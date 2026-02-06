import { TestBed } from '@angular/core/testing';

import { ZeroInstantNotificationService } from './zero-instant-notification.service';

describe('ZeroInstantNotificationService', () => {
  let service: ZeroInstantNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZeroInstantNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
