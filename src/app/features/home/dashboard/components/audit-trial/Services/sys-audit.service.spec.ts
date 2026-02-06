import { TestBed } from '@angular/core/testing';

import { SysAuditService } from './sys-audit.service';

describe('SysAuditService', () => {
  let service: SysAuditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SysAuditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
