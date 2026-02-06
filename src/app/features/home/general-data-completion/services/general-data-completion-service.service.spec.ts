import { TestBed } from '@angular/core/testing';

import { GeneralDataCompletionServiceService } from './general-data-completion-service.service';

describe('GeneralDataCompletionServiceService', () => {
  let service: GeneralDataCompletionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralDataCompletionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
