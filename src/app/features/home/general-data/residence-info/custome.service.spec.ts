import { TestBed } from '@angular/core/testing';

import { CustomeService } from './custome.service';

describe('CustomeService', () => {
  let service: CustomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
