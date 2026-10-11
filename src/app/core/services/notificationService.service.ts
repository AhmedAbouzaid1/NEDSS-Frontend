import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  map,
  of,
} from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';

import { HttpClient } from '@angular/common/http';
//import { NotificationDto } from '../Models/NotificationDto';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { NotificationDTO } from 'src/app/models/notification-dto';
import { NotificationDto } from 'src/app/features/home/Notification/Models/NotificationDto';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  ssSubj = new Subject<any>();
  public AllLegnth: any[] = [];
  private notifications: /*NotificationDto[]*/ any = [];
  public hubConnection: signalR.HubConnection;
  private NotificationsControllerURL: string =
    environment.baseApiUrl + 'Notifications/';
  private AccountControllerURL: string = environment.baseApiUrl + 'Account/';
  private Datalegnth = new BehaviorSubject<any>(0);
  castDatalegnth = this.Datalegnth.asObservable();
  private Data = new BehaviorSubject<NotificationDTO[]>([]);
  castData = this.Data.asObservable();
  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();
  private receivedSubject = new Subject<NotificationDTO>();
  received$ = this.receivedSubject.asObservable();
  constructor(
    private APIs: BaseAPIService,
    private userMsg: UserMessageService
  ) {
    //this.getNotifications();
    //this.startConnection();
  }
  // public startConnection = () => {
  //   this.hubConnection = new signalR.HubConnectionBuilder()
  //     .withUrl(`${environment.baseApiUrl}notificationhub`, {
  //       transport: signalR.HttpTransportType.WebSockets,
  //       //skipNegotiation: true,
  //       withCredentials: false
  //     })
  //     .withAutomaticReconnect()
  //     .build();
  //   this.hubConnection
  //     .start()
  //     .then(() => {
  //       console.log('Connection started for notifications');
  //     })
  //     .catch((err) => {
  //       console.log('Error while starting connection: ' + err);
  //       return false;
  //     });
  //   // this.hubConnection.on(
  //   //   'notificationReceived',
  //   //   (data: NotificationDto) => {
  //   //     console.log('notification Received');
  //   //     console.log(data);
  //   //     this.userMsg.info(data.message);
  //   //     this.notifications.push(data);
  //   //   }
  //   // );
  // };
  ssObs(): Observable<any> {
    return this.ssSubj.asObservable();
  }
  public getAllNotifications() {
    //:Observable<NotificationDto[] | null>
    return this.APIs.get(this.NotificationsControllerURL + 'GetAll');
  }
  public UserConnected() {
    let userId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    ).userId;

    this.hubConnection.invoke('UserConnected', Number(userId));
  }
  // } else {
  //   this.hubConnection.invoke('sendNotification', notificationDTO);
  // }
  public getMySummary(): Observable<any> {
    return this.APIs.getInBackground(
      this.NotificationsControllerURL + 'GetMySummary'
    );
  }

  public getMyFeed(beforeId: number | null, pageSize: number): Observable<any> {
    const cursor = beforeId != null ? `&beforeId=${beforeId}` : '';
    return this.APIs.getInBackground(
      `${this.NotificationsControllerURL}GetMyFeed?pageSize=${pageSize}${cursor}`
    );
  }

  public setUnreadCount(count: number) {
    this.unreadCountSubject.next(Math.max(0, count || 0));
  }

  public adjustUnreadCount(delta: number) {
    this.setUnreadCount(this.unreadCountSubject.value + delta);
  }

  public notifyReceived(notification: NotificationDTO) {
    if (!notification?.seen) {
      this.adjustUnreadCount(1);
    }
    this.receivedSubject.next(notification);
  }

  public DeleteAll() {
    return this.APIs.delete(this.NotificationsControllerURL + 'DeleteAll');
  }
  public DeleteNotification(id) {
    return this.APIs.delete(
      this.NotificationsControllerURL + 'Delete?id=' + id
    );
  }
  public getPageNotifications(
    filter: any //:Observable<NotificationDto[] | null>
  ) {
    return this.APIs.create(
      this.NotificationsControllerURL + 'GetPage',
      filter
    );
  }

  public removeNotification(not: NotificationDTO) {
    if (not.title === 'chat') {
      not.message = '0';
      not.seen = true;
    }
    return this.APIs.create(
      this.NotificationsControllerURL + 'UpdateNotification',
      not
    );
  }

  public updateNotificationByChatId(not: NotificationDTO) {
    if (not.title === 'chat') {
      not.message = '0';
      not.seen = true;
    }
    return this.APIs.create(
      this.NotificationsControllerURL + 'UpdateNotificationsByChatId',
      not
    );
  }

  public getInactiveUsers(userID: number) {
    return this.APIs.get(
      this.AccountControllerURL + 'GetInactiveUsers?userID=' + userID
    );
  }

  getNotifications() {
    //   this.notificationService.getAllNotifications().subscribe( (res)=>{
    //     this.notifications=res.data;
    // });
    let userId = JSON.parse(
      localStorage.getItem('ls.authorizationData')
    ).userId;
    this.getPageNotifications({ systemUserId: userId }).subscribe(
      (res) => {
        this.AllLegnth = res.data;
      },
      (err) => {
        console.log(err);
      },
      () => {
        this.Data.next(this.AllLegnth);
        this.Data.next(this.AllLegnth);
        this.setValue(this.AllLegnth.length);
      }
    );
  }

  setValue(value: any) {
    this.Datalegnth.next(value);
  }
}
