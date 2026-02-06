import { TestBed } from '@angular/core/testing';

import { PreparationsService } from './preparations.service';

describe('PreparationsService', () => {
  let service: PreparationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreparationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
