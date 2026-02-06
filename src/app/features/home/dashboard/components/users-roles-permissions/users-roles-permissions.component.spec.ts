import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersRolesPermissionsComponent } from './users-roles-permissions.component';

describe('UsersRolesPermissionsComponent', () => {
  let component: UsersRolesPermissionsComponent;
  let fixture: ComponentFixture<UsersRolesPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersRolesPermissionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersRolesPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
