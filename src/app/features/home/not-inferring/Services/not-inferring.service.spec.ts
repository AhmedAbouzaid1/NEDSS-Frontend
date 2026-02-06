import { TestBed } from '@angular/core/testing';

import { NotInferringService } from './not-inferring.service';

describe('NotInferringService', () => {
  let service: NotInferringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotInferringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
