import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../Services/user.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';

@Component({
  selector: 'app-user-approvals',
  templateUrl: './user-approvals.component.html',
  styleUrls: ['./user-approvals.component.css'],
})
export class UserApprovalsComponent implements OnInit {
  invitations: any[] = [];
  loading: boolean = false;

  declineShow: boolean = false;
  declineReason: string = '';
  declineTarget: any = null;

  reviewShow: boolean = false;
  reviewTarget: any = null;

  openReview(item: any) {
    this.reviewTarget = item;
    this.reviewShow = true;
  }

  constructor(
    private userService: UserService,
    private translateService: TranslateService,
    private userMsg: UserMessageService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.userService.getInvitations().subscribe(
      (response: any) => {
        this.loading = false;
        this.invitations = response?.data ?? [];
      },
      () => {
        this.loading = false;
      }
    );
  }

  approve(item: any) {
    this.userService.approveInvitation(item.id).subscribe(
      (response: any) => this.afterAction(response),
      () => this.showError()
    );
  }

  openDecline(item: any) {
    this.declineTarget = item;
    this.declineReason = '';
    this.declineShow = true;
  }

  confirmDecline() {
    if (!this.declineTarget) return;
    this.userService
      .declineInvitation({ invitationId: this.declineTarget.id, reason: this.declineReason })
      .subscribe(
        (response: any) => {
          this.declineShow = false;
          this.afterAction(response);
        },
        () => this.showError()
      );
  }

  private afterAction(response: any) {
    if (response?.statusCode && response.statusCode >= 400) {
      this.userMsg.error((response.messages && response.messages[0]) || '');
      return;
    }
    this.translateService
      .get('NEDSS.COMMON.SENT_SUCESSFULLY')
      .subscribe((res: string) => this.userMsg.success(res));
    this.load();
  }

  private showError() {
    this.translateService
      .get('NEDSS.COMMON.SENT_FAILD')
      .subscribe((res: string) => this.userMsg.error(res));
  }
}
