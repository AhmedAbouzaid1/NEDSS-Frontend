import { TestBed } from '@angular/core/testing';

import { UsersRolesPermissionsService } from './users-roles-permissions.service';

describe('UsersRolesPermissionsService', () => {
  let service: UsersRolesPermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersRolesPermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
