/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AddPopulationServiceService } from './addPopulationService.service';

describe('Service: AddPopulationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddPopulationServiceService]
    });
  });

  it('should ...', inject([AddPopulationServiceService], (service: AddPopulationServiceService) => {
    expect(service).toBeTruthy();
  }));
});
