import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { UserService } from '../Services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersRolesPermissionsService } from '../../dashboard/components/users-roles-permissions/Services/users-roles-permissions.service';
import { SystemUserDTO } from '../../chat/Models/UserDto';
import { Result } from 'src/app/features/Result';
import { Organiztion } from '../../chat/Models/organiztion';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit, OnChanges {
  @Input() userID: number = 0;
  user: SystemUserDTO = {};
  loading: boolean = false;
  organizations: Organiztion[];
  constructor(
    private userService: UserService,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private lookupsGetterService: LookupsGetterService,
    private route: ActivatedRoute,
    private router: Router,
    private usersRolesPermissionService: UsersRolesPermissionsService
  ) { }
  ngOnInit() {
    this.getOrgs();

    if (this.userID == 0) {
      this.userID = parseInt(this.route.snapshot.paramMap.get("id"));
    }
    console.log(this.userID);
    if (this.userID != null) {
      this.getById(this.userID);
    }
  }
  ngOnChanges() {
    if (this.userID != null) {
      this.getById(this.userID);
    }
  }
  getById(id) {
    this.loading = true;
    this.userService.getUserById(id).subscribe({
      next: (result: Result<SystemUserDTO>) => {
        if (result != null && result != undefined) {
          this.user = result.data;
        }
      },
      error: (err) => {
        this.loading = false;
        this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
          this.userMsg.error(res);
        });
      },
      complete: () => {
        this.loading = false;
        console.log(this.user);
      }
    })
  }
  getOrgs() {
    this.lookupsGetterService.getAllOrganizations().subscribe({
      next: (result: Result<Organiztion[]>) => {
        this.organizations = result.data;
      },
      error: () => { },
      complete: () => { }
    })
  }
  getOrgName(id) {
    if (id !== null && id !== undefined) {
      return this.organizations?.find(x => x.id == id)?.arabicName ?? "";
    }
    else return "";
  }
}
