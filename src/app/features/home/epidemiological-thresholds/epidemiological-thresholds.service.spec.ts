import { TestBed } from '@angular/core/testing';

import { EpidemiologicalThresholdsService } from './epidemiological-thresholds.service';

describe('EpidemiologicalThresholdsService', () => {
  let service: EpidemiologicalThresholdsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EpidemiologicalThresholdsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
