import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserMessageService } from '../../services/user.message.service';
import { Router } from '@angular/router';
import { LocalizationService } from '../../services/localization.service';
import { LookupsGetterService } from '../../services/lookups-getter.service';
import { NotificationService } from '../../services/notificationService.service';
import { Result } from 'src/app/features/Result';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { NotificationDTO } from 'src/app/models/notification-dto';
import { ChangenpasswordComponent } from '../changenpassword/changenpassword.component';
import { GeneralDataService } from 'src/app/features/home/general-data/services/general-data.service';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { UiLoadingService } from '../../services/ui-loading.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  username: any;
  incidentSourceName: any;
  userLevel: any;
  applanguages: any;
  language: any;
  sigrID: string = '';
  notifications: NotificationDTO[] = [];
  chatNotifications: NotificationDTO = {};
  private hubConnection: signalR.HubConnection;
  userId: number = 0;
  notstr: string = '';
  readonly defaultUserImage = 'assets/default-user.webp';
  userImage: string = this.defaultUserImage;
  hasProfileImage = false;

  constructor(
    private notificationService: NotificationService,
    private auth: AuthService,
    private userMsg: UserMessageService,
    private router: Router,
    private localizationService: LocalizationService,
    private lookupService: LookupsGetterService,
    private generalDataService: GeneralDataService,
    private translate: TranslateService,
    private uiLoadingService: UiLoadingService,
    private session: SessionService
  ) {
    this.username = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    ).userName;
    let img = JSON.parse(localStorage.getItem('ls.authorizationData')).user
      .profilePic;
    this.userImage = this.getProfileImageOrDefault(img);
    this.hasProfileImage = this.hasValidProfileImage(img);
    this.incidentSourceName = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    ).user.incidentSourceName;

    if (this.incidentSourceName != null && this.incidentSourceName != '') {
      this.userLevel = this.incidentSourceName;
    } else {
      this.userLevel = JSON.parse(
        localStorage.getItem('ls.authorizationData')
      ).user.levelName;
    }
  }

  getProfileImageOrDefault(profilePic: unknown): string {
    return this.hasValidProfileImage(profilePic)
      ? profilePic
      : this.defaultUserImage;
  }

  hasValidProfileImage(profilePic: unknown): profilePic is string {
    return typeof profilePic === 'string' && profilePic.trim().length > 0;
  }

  get avatarInitials(): string {
    const name = `${this.username || ''}`.trim();
    return name ? name.slice(0, 2).toUpperCase() : 'NA';
  }

  useDefaultAvatar(event: Event) {
    this.hasProfileImage = false;
    const image = event.target as HTMLImageElement;
    image.src = this.defaultUserImage;
  }

  @HostListener('window:online', ['$event'])
  onOnline(event) {
    this.generalDataService.syncData();
  }
  load(notification: NotificationDTO) {
    notification.seen = true;
    this.notificationService.removeNotification(notification).subscribe({
      next: (x) => null,
      error: (err) => console.error(err),
      complete: () =>
        (this.notifications = this.notifications.filter((x) => !x.seen)),
    });
    this.router.navigateByUrl(notification.url);
    setTimeout(() => {
      window.location.reload();
    }, 10);
  }
  public UserConnected = () => {
    this.hubConnection.invoke('UserConnected', this.userId);
  };
  public startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.baseApiUrl}NotificationHub`, {
        transport: signalR.HttpTransportType.WebSockets,
        withCredentials: false,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        this.UserConnected();

        this.hubConnection.on(
          'UsersConnectedIncrement',
          (ConnectedUsersCount) => {
            this.lookupService.$ConnectedUsersCount.next(ConnectedUsersCount);
          }
        );
        //message received
        this.hubConnection.on(
          'notificationReceived',
          (data: NotificationDTO) => {
            if (data.title != 'chat') this.notifications.push(data);
            if (
              this.chatNotifications != null &&
              this.chatNotifications != undefined &&
              Number(this.chatNotifications.message) >= 0 &&
              data.title === 'chat'
            ) {
              this.chatNotifications.message = (
                Number(this.chatNotifications.message) + Number(data.message)
              ).toString();
            } else if (data.message === 'chat') {
              this.chatNotifications = this.notifications.filter(
                (x) => x.title === 'chat'
              )[0];
            } else {
              this.notifications = this.notifications.filter(
                (x) => x.title !== 'chat'
              );
            }
          }
        );

        //updatedChatNotificationsCount
        this.hubConnection.on(
          'updatedChatNotificationsCount',
          (data: string) => {
            if (data != null) this.chatNotifications.message = data;
          }
        );
      })
      .catch((err) => {
        console.log('Error while starting connection: ' + err);
      });
  }
  public sendNotification(userIDs: number[], not: NotificationDTO) {
    this.hubConnection
      .invoke('sendNotification', userIDs, not)
      .catch((err) => console.error(err));
    this.hubConnection.on(
      'notificationReceived',
      (connID: string, msg: NotificationDTO) => {
        if (this.notifications.find((x) => x.title == 'chat')) {
          this.notifications[0].message = (
            Number(this.notifications[0].message) + 1
          ).toString();
        }
        this.notifications = this.notifications.filter(
          (x) => x.title !== 'chat'
        );
      }
    );
  }

  RemoveChatNotifications() {
    this.notificationService
      .removeNotification(this.chatNotifications)
      .subscribe({
        next: (x) => null,
        error: (err) => console.error(err),
        complete: () => {},
      });
  }
  ngOnInit() {
    this.chatNotifications.message = '0';
    this.getAppLanguages();
    this.language =
      localStorage.getItem('ls.currentLang') !== undefined &&
      localStorage.getItem('ls.currentLang') !== 'undefined'
        ? localStorage.getItem('ls.currentLang')
        : 'ar';
    this.userId = parseInt(
      JSON.parse(localStorage.getItem('ls.authorizationData')).userId
    );
    this.startConnection();

    this.notificationService.getInactiveUsers(this.userId).subscribe({
      next: (res) => {},
      error: () => {},
      complete: () => {
        this.getAllNotifications();
      },
    });
  }

  getAllNotifications() {
    let userId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    ).userId;

    this.notificationService
      .getPageNotifications({ systemUserId: userId })
      .subscribe({
        next: (res: Result<NotificationDTO[]>) => {
          this.notifications = res.data;
        },
        error: (err) => console.error(err),
        complete: () => {
          this.chatNotifications = this.notifications.filter(
            (x) => x.title === 'chat'
          )[0];
          this.notifications = this.notifications.filter(
            (x) => x.title !== 'chat'
          );
          if (
            this.chatNotifications != null &&
            this.chatNotifications != undefined &&
            Number(this.chatNotifications.message) >= 0
          ) {
          } else {
            this.chatNotifications = { message: '0', title: 'chat' };
          }
        },
      });
  }
  getAppLanguages() {
    this.uiLoadingService.isLoading = true;
    this.lookupService
      .getAllAppLanguages()
      .pipe(finalize(() => (this.uiLoadingService.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          this.applanguages = res.data;
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {},
      });
  }

  langChanged(language: string) {
    this.language = language;
    this.localizationService.changeLanguage(language);
    setTimeout(() => {
      location.reload();
    }, 600);
  }

  logout() {
    const finish = () => {
      this.session.clear();
      this.auth.setUserLoggedIn(false);
      this.translate.get('NEDSS.HOME.LOGOUT.SIGNING_OUT').subscribe((msg) => {
        this.userMsg.success(msg);
      });
      this.router.navigateByUrl('');
    };
    this.auth.logout().subscribe({ next: finish, error: finish });
  }
  testNot() {
    let not: NotificationDTO = {};
    not.createdDate = new Date();
    not.hasUrl = false;
    not.message = this.notstr;
    not.seen = false;
    not.systemUserId = 2;
    not.title = this.notstr;
    not.url = '';
    not.user = {};

    this.sendNotification([1010, 2], not);
  }

  password: null;
  confirmPassword: null;
  chngPassword() {
    this.visible = true;
    this.auth.setUserLoggedIn(true);
  }
  visible;

  onFireModel() {
    this.visible = true;
  }

  // DARK MODE

  dark: boolean = false;

  toggleDarkLight() {
    let body = document.getElementById('body');
    let currentClass = body.className;
    body.className = currentClass == 'dark-mode' ? 'light-mode' : 'dark-mode';

    // let darkmo = document.getElementById("btn-color-dark");

    this.dark = !this.dark;
  }

  @ViewChild(ChangenpasswordComponent)
  changePasswordComponent: ChangenpasswordComponent;
  onSendForm() {
    if (
      this.changePasswordComponent.changePasswordForm.value.newPassword !=
      this.changePasswordComponent.changePasswordForm.value.confirmPassword
    ) {
      this.translate
        .get('NEDSS.HOME.CHANGE_PASSWORD.INCORRECT_NEW_AND_CONFIRM')
        .subscribe((msg) => {
          this.userMsg.warn(msg);
        });
    } else if (!this.changePasswordComponent.isNewPasswordValid()) {
      this.translate
        .get('NEDSS.HOME.CHANGE_PASSWORD.RULES_NOT_MET')
        .subscribe((msg) => {
          this.userMsg.warn(msg);
        });
    } else if (this.changePasswordComponent.changePasswordForm.valid) {
      this.auth
        .changePassword(this.changePasswordComponent.changePasswordForm.value)
        .subscribe(
          (res) => {
            if (res.messages.length > 0) {
              this.userMsg.error(res.messages[0]);
            } else {
              this.translate
                .get('NEDSS.HOME.CHANGE_PASSWORD.SUCCESSFUL_CHANGE_PASSWORD')
                .subscribe((msg) => {
                  this.userMsg.success(msg);
                });
              this.visible = false;
            }
          },
          (err) => {
            const backendMsg =
              err?.error?.messages?.[0] || err?.error?.Messages?.[0];
            if (backendMsg) {
              this.userMsg.error(backendMsg);
            } else {
              this.translate
                .get('NEDSS.HOME.CHANGE_PASSWORD.SOMETHING_WENT_WRONG')
                .subscribe((msg) => {
                  this.userMsg.error(msg);
                });
            }
          }
        );
    } else {
      this.userMsg.error(' حدث خطا من فضلك ادخل البيانات بطريقة صحيحة ');
    }
  }
}
