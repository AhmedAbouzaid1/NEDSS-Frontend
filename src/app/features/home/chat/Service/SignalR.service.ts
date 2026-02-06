import { catchError } from 'rxjs';
import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { environment } from 'src/environments/environment';
import { ChatMessageDto } from '../Models/ChatMessageDto';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private userId: number;

  private hubConnection: signalR.HubConnection;
  public startConnection = (uId) => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.baseApiUrl}chatHub`, {
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
        /*, skipNegotiation:true*/
        , withCredentials: false
      })
      .withAutomaticReconnect()
      .build();
    this.userId = uId;
    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started');
        this.UserConnected();
        this.hubConnection.on('messageReceived', (data: ChatMessageDto) => {
          console.log("message Received");
          console.log(data);

          //return data;
        });
      }
      )
      .catch(err => {
        console.log('Error while starting connection: ' + err);
        return false;
      });


  }
  constructor() { }



  public UserConnected = () => {
    console.log(`will connect with user id : ${this.userId}`);
    this.hubConnection.invoke("UserConnected", this.userId);
  }
  //public UserDisconnected =(userId:number)=>{
  //this.hubConnection.invoke("UserDisconnected",userId);
  //}
  public sendMessage = (dto: ChatMessageDto) => {
    this.hubConnection.invoke("sendMessage", dto)
      .catch(err => console.log(`error on sending message : ${err}`));
    console.log("message sent");
  }

}
