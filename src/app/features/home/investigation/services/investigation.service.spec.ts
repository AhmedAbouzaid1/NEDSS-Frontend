/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { InvestigationService } from './investigation.service';

describe('Service: Investigation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InvestigationService]
    });
  });

  it('should ...', inject([InvestigationService], (service: InvestigationService) => {
    expect(service).toBeTruthy();
  }));
});
