import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, finalize } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notificationService.service';
import { NotificationTypesEnum } from './models/types.enum';
import { TranslateService } from '@ngx-translate/core';
import { UserMessageService } from 'src/app/core/services/user.message.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit, OnDestroy {
  readonly pageSize = 20;
  notifications: any[] = [];
  NotificationsTypesEnum = NotificationTypesEnum;
  loading = false;
  hasMore = true;
  loadFailed = false;
  initialized = false;

  private observer?: IntersectionObserver;
  private sentinel?: HTMLElement;
  private receivedSub?: Subscription;

  @ViewChild('scrollSentinel')
  set scrollSentinel(ref: ElementRef<HTMLElement> | undefined) {
    if (this.sentinel) {
      this.observer?.unobserve(this.sentinel);
    }
    this.sentinel = ref?.nativeElement;
    if (this.sentinel) {
      this.observer?.observe(this.sentinel);
    }
  }

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private translateService: TranslateService,
    private userMsg: UserMessageService,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          this.zone.run(() => this.loadNextPage());
        }
      },
      { rootMargin: '0px 0px 300px 0px' }
    );
    if (this.sentinel) {
      this.observer.observe(this.sentinel);
    }

    this.receivedSub = this.notificationService.received$.subscribe((n) => {
      if (n?.id && !this.notifications.some((x) => x.id === n.id)) {
        this.notifications = [n, ...this.notifications];
      }
    });

    this.loadNextPage();
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    this.receivedSub?.unsubscribe();
  }

  loadNextPage() {
    if (this.loading || !this.hasMore) {
      return;
    }
    this.loading = true;
    this.loadFailed = false;
    const last = this.notifications[this.notifications.length - 1];
    const beforeId = last?.id ?? null;

    this.notificationService
      .getMyFeed(beforeId, this.pageSize)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.initialized = true;
        })
      )
      .subscribe({
        next: (res: any) => {
          const items: any[] = res?.data?.items ?? [];
          const known = new Set(this.notifications.map((x) => x.id));
          this.notifications = [
            ...this.notifications,
            ...items.filter((x) => !known.has(x.id)),
          ];
          this.hasMore = !!res?.data?.hasMore;
          this.rearmObserver();
        },
        error: (err) => {
          console.error(err);
          this.loadFailed = true;
        },
      });
  }

  retry() {
    this.loadFailed = false;
    this.loadNextPage();
  }

  private rearmObserver() {
    if (!this.hasMore || !this.sentinel || !this.observer) {
      return;
    }
    const sentinel = this.sentinel;
    setTimeout(() => {
      this.observer?.unobserve(sentinel);
      this.observer?.observe(sentinel);
    });
  }

  trackById(_: number, item: any) {
    return item.id;
  }

  DeleteAll() {
    this.notificationService.DeleteAll().subscribe({
      next: () => {
        this.notifications = [];
        this.hasMore = false;
        this.notificationService.setUnreadCount(0);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  deleteNotification(item: any) {
    this.notificationService.DeleteNotification(item.id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter((x) => x.id !== item.id);
        if (!item.seen) {
          this.notificationService.adjustUnreadCount(-1);
        }
        this.translateService
          .get('NEDSS.COMMON.DELETED_SUCESSFULLY')
          .subscribe((res: string) => {
            this.userMsg.success(res);
          });
        this.rearmObserver();
      },
      error: () => {
        this.translateService
          .get('NEDSS.COMMON.DELETED_FAILED')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      },
    });
  }

  load(url: any, item: any) {
    if (!item.seen) {
      item.seen = true;
      this.notificationService.adjustUnreadCount(-1);
      this.notificationService.removeNotification({ ...item, seen: true }).subscribe({
        error: (err) => {
          console.error(err);
          item.seen = false;
          this.notificationService.adjustUnreadCount(1);
        },
      });
    }
    if (!item.hasUrl || !url) {
      return;
    }
    const extraData = Number(item.extraData);
    this.router.navigateByUrl(
      '/home' + url + (item.extraData ? `?id=${extraData}` : '')
    );
  }
}
