import { TestBed } from '@angular/core/testing';

import { GeneralDataService } from './general-data.service';

describe('GeneralDataServiceService', () => {
  let service: GeneralDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
