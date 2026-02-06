import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { NotificationService } from 'src/app/core/services/notificationService.service';
import { NotificationTypesEnum } from './models/types.enum';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  userId: number = 0;
  NotificationsTypesEnum = NotificationTypesEnum;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private lookupsService: LookupsGetterService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) {}

  ngOnInit() {
    this.userId = parseInt(
      JSON.parse(localStorage.getItem('ls.authorizationData')).userId
    );
    this.getNotifications();
  }

  getNotifications() {
    this.notificationService
      .getPageNotifications({ systemUserId: this.userId })
      .subscribe({
        //TODO uncomment this when backend is edited
        // next: (nots) => { this.notifications = nots.data?.filter((n: any) => this.lookupsService.incidentsForOrg.includes(n?.user?.incidentSourceId)) },
        next: (nots) => {
          this.notifications = nots.data;
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          // console.log(this.notifications);
          if (this.notifications != null && this.notifications != undefined) {
            this.notifications.forEach((element) => {
              element.isExpanded = false;
            });
          }
        },
      });
  }

  DeleteAll() {
    this.notificationService.DeleteAll().subscribe({
      next: (nots) => {
        /*this.notifications = nots.data;*/
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        // this.location.go(this.location.path());
        window.location.reload();
      },
    });
  }

  deleteNotification(id) {
    this.notificationService.DeleteNotification(id).subscribe({
      next: () => {},
      error: (err) => {
        this.translateService
          .get('NEDSS.COMMON.DELETED_FAILED')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      },
      complete: () => {
        this.translateService
          .get('NEDSS.COMMON.DELETED_SUCESSFULLY')
          .subscribe((res: string) => {
            this.userMsg.success(res);
          });
        this.getNotifications();
      },
    });
  }

  items = [
    {
      id: 1,
      title: 'Item 1',
      content: 'Content for Item 1',
      isExpanded: false,
    },
    {
      id: 2,
      title: 'Item 2',
      content: 'Content for Item 2',
      isExpanded: false,
    },
    {
      id: 3,
      title: 'Item 3',
      content: 'Content for Item 3',
      isExpanded: false,
    },
  ];

  toggleCollapse(item) {
    item.isExpanded = !item.isExpanded;
  }

  load(url: any, item: any) {
    item.seen = true;
    this.notificationService.removeNotification(item).subscribe({
      next: (x) => null,
      error: (err) => console.error(err),
      complete: () => {
        this.items = this.items.filter((x) => x.id != item.id);
      },
    });
    const extraData = Number(item.extraData);
    this.router.navigateByUrl(
      '/home' + url + (item.extraData ? `?id=${extraData}` : '')
    );
    // setTimeout(() => {
    //   window.location.reload();
    // }, 10);
  }
}
