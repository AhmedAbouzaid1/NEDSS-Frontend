/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RepeatedService } from './Repeated.service';

describe('Service: Repeated', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RepeatedService]
    });
  });

  it('should ...', inject([RepeatedService], (service: RepeatedService) => {
    expect(service).toBeTruthy();
  }));
});
