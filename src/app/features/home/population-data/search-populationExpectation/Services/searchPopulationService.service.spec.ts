/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SearchPopulationService } from './searchPopulationService.service';

describe('Service: SearchPopulationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchPopulationService]
    });
  });

  it('should ...', inject([SearchPopulationService], (service: SearchPopulationService) => {
    expect(service).toBeTruthy();
  }));
});
