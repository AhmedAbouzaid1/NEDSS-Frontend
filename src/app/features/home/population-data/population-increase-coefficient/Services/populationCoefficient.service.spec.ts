/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PopulationCoefficientService } from './populationCoefficient.service';

describe('Service: PopulationCoefficient', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PopulationCoefficientService]
    });
  });

  it('should ...', inject([PopulationCoefficientService], (service: PopulationCoefficientService) => {
    expect(service).toBeTruthy();
  }));
});
