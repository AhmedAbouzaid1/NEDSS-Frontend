import { TestBed } from '@angular/core/testing';

import { CloseSeatioService } from './close-seatio.service';

describe('CloseSeatioService', () => {
  let service: CloseSeatioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloseSeatioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
