/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AnnouncmentServiceService } from './announcmentService.service';

describe('Service: AnnouncmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnnouncmentServiceService]
    });
  });

  it('should ...', inject([AnnouncmentServiceService], (service: AnnouncmentServiceService) => {
    expect(service).toBeTruthy();
  }));
});
