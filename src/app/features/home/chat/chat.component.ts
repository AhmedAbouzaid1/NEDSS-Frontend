import { DefaultImage } from './../../../core/constants';
import { FinalResultComponent } from './../dashboard/components/codes/final-result/final-result.component';
import * as signalR from '@microsoft/signalr';
import { Component, OnInit } from '@angular/core';
import { ChatService } from './Service/ChatService.service';
import { ChatDto } from './Models/ChatDto';
import { ChatMessageDto } from './Models/ChatMessageDto';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { UserChatMappingDto } from './Models/UserChatMappingDto';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpEventType, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { LookupsGetterService } from 'src/app/core/services/lookups-getter.service';
import { UserMessageService } from 'src/app/core/services/user.message.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../users/Services/user.service';
import { SystemUser, SystemUserDTO, SystemUserDataDto } from './Models/UserDto';
import { HealthAdministrationDTO } from '../../Models/health-administration';
import { Result } from '../../Result';
import { NotificationService } from 'src/app/core/services/notificationService.service';
import { NotificationDTO } from 'src/app/models/notification-dto';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  status: number = 0;
  update: number = 0;
  dialogOpen: boolean = false;
  users: any[] = [];
  chatUsers: SystemUser[] = [];
  msg = new FormControl();
  groupName = new FormControl();
  chatName: string = "";
  availableUsers: SystemUserDataDto[] = [];
  chatMaps: UserChatMappingDto[] = [];
  user: SystemUserDTO = {};
  chats;
  govID: number = 0;
  loadingPanel: boolean = false;
  filePath: string = null;
  currentChat: ChatDto = {};
  userId;
  imageUploaded: boolean = false;
  attachUploaded: boolean = false;
  chatMsg: ChatMessageDto = new ChatMessageDto;
  userToChatWith: any;
  ChatOpended: boolean;
  usersAvailableForChats;
  governments: any;
  years: any;
  healthAdministration: any;
  healthAdmins: HealthAdministrationDTO[] = [];
  department: any;
  incidentSources: any;
  searchUserFormGroup: FormGroup;
  private hubConnection: signalR.HubConnection;
  deleteUserID: number = 0;
  notifications: NotificationDTO[] = [];
  chatNotifications: NotificationDTO = {};

  loaded: boolean = false;
  overlayColor: string = 'rgba(255,255,255,0.5)';
  imageSrc: string = 'assets/upload-image.webp';
  iconColor: string;
  imageLoaded: boolean = false;
  // defaultImage = DefaultImage;
  defaultUserImg = 'assets/default-user.webp';
  defaultConversationImg = 'assets/conversation.webp';
  constructor(private userService: UserService, private chatService: ChatService,
    private http: HttpClient, private lookupsService: LookupsGetterService, private userMsg: UserMessageService,
    private translateService: TranslateService, private notificationService: NotificationService) { }

  ngOnInit() {
    this.userId = parseInt(JSON.parse(localStorage.getItem("ls.authorizationData")).userId);
    this.userService.getUserById(this.userId).subscribe({
      next: (x: Result<SystemUserDTO>) => this.user = x.data,//this.user = x,
      error: err => console.error(err),
      complete: () => {
        this.update++;
      }
    });
    this.getLookups();
    this.searchUserFormGroup = new FormGroup({
      govenmentId: new FormControl(),
      healthAdministrationId: new FormControl(),
      incidentSourceId: new FormControl(),
      departmentId: new FormControl()
    });
    this.getAllChats();
    this.getAllNotifications();
    //this.getAllUsersForChat();
    //this.signalRService.startConnection(this.userId);
    this.startConnection();

  }
  getLookups() {
    //this.getGovernments();
    //this.getHealthAdministration();
    //this.getIncidentSources();
    //this.getDepartments();
  }

  UpdateUsers(users: SystemUserDataDto[]) {
    this.availableUsers = users;
  }

  updateName(chatName: string) {
    this.chatName = chatName;
  }

  getDepartments() {
    this.lookupsService.getAllDepartments().subscribe({
      next: (result: any) => {
        if (result != null && result != undefined && result.data != undefined) {
          this.department = result.data;
        }
        this.loadingPanel = false;
      },
      error: error => {
        this.loadingPanel = false;
        this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
          this.userMsg.error(res);
        });
      }
    });
  }

  loadChat(user) {
    this.ChatOpended = true;
    this.userToChatWith = this.users.filter(x => x.id == user.id)[0]
  }

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.baseApiUrl}chatHub`, {
        transport: signalR.HttpTransportType.WebSockets// | signalR.HttpTransportType.LongPolling
        /*, skipNegotiation:true*/
        , withCredentials: false
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        this.UserConnected();
        //message received
        this.hubConnection.on('messageReceived', (data: ChatMessageDto) => {

          var x = this.chats.find(o => o.id == data.chatId)
          if (x != undefined) {
            // if (this.currentChat.id == data.chatId) {
            //   this.currentChat.chatMessages.push(data);
            // }
            x.lastActivity = data.sentAt;
            x.chatMessages.push(data);
            this.refreshChats();
          }

        });
        //chat created
        this.hubConnection.on('chatCreated', (data: ChatDto) => {
          this.chats.push(data);
          this.refreshChats();
          location.reload();
        });
        //user added
        this.hubConnection.on('userAdded', (data: UserChatMappingDto) => {

          var x = this.chats.find(o => o.id == data.chatId)
          if (x != undefined) {

            x.userChatMappings.push(data);
            this.refreshChats();
          }
        });
      }
      )
      .catch(err => {
        console.log('Error while starting connection: ' + err);
      });
  }

  renderChat(chat: ChatDto) {
    this.RemoveChatNotifications();
    this.currentChat = chat;
    this.ChatOpended = true;
    this.currentChat.chatMessages = this.currentChat.chatMessages;
    this.chatService.getCurrentChatUsers(chat.id).subscribe({
      next: (r: Result<SystemUser[]>) => this.chatUsers = r.data,
      error: err => console.error(err),
      complete: () => this.update++
    });
    this.chatService.GetUserChatMappings(chat.id).subscribe({
      next: (r: Result<UserChatMappingDto[]>) => { this.chatMaps = r.data; },
      error: err => { console.error(err) },
      complete: () => {
        this.loadingPanel = false;
        let x = document.getElementById("chat-body");
        //alert(x.scrollHeight);
        x.scrollTo(0, x.scrollHeight);
      }
    })
  }

  getAllNotifications() {
    //   this.notificationService.getAllNotifications().subscribe( (res)=>{
    //     this.notifications=res.data;
    // });

    let userId = JSON.parse(localStorage.getItem('ls.authorizationData')).userId;

    this.notificationService.getPageNotifications({ systemUserId: userId }).subscribe({
      next: (res: Result<NotificationDTO[]>) => { this.notifications = res.data; },
      error: err => console.error(err),
      complete: () => {
        //console.log(this.notifications);
        this.chatNotifications = this.notifications.filter(x => x.title === "chat")[0];
        this.notifications = this.notifications.filter(x => x.title !== "chat");
        //console.log(this.chatNotifications);
        //console.log(this.notifications);
        if (this.chatNotifications != null && this.chatNotifications != undefined && Number(this.chatNotifications.message) >= 0) {
          //this.showChatNotifications = true;
        }
        else {
          this.chatNotifications = { message: "0", title: "chat" }
        }
      }
    });
  }

  RemoveChatNotifications() {
    if (this.chatNotifications?.id == null) {
      this.getAllNotifications();
      return;
    }
    this.notificationService.removeNotification(this.chatNotifications).subscribe({
      next: x => null,
      error: err => console.error(err),
      complete: () => { /*this.showChatNotifications = false*/ }
    });
  }

  getUserName(id: number) {
    return this.chatUsers.find(x => x.id === id)?.fullName;
  }
  getUserNameBychatMappingIdForCurrentChatMessage(message: ChatMessageDto) {
    for (var i = 0; i < this.currentChat.userChatMappings.length; i++) {
      if (this.currentChat.userChatMappings[i].userId == message.userId) {
        return this.currentChat.userChatMappings[i].userName;
      }
    }
    return null;
  }
  getAllUsersForChat() {
    this.userService.getPageUsers(this.searchUserFormGroup.value).subscribe(
      (res) => {
        if (res.data.length == 0) {
          return;
        }
        this.usersAvailableForChats = res.data;
        this.usersAvailableForChats = this.usersAvailableForChats.filter(item => !(item.id == this.userId));
        this.usersAvailableForChats.forEach(el => {
          el.isSelected = false;
        });
      }
    );
  }
  getAllChats() {
    this.chatService.getAllChats().subscribe(
      (res) => {
        if (res.data.length == 0) {
          return;
        }
        res.data.forEach(o => {
          o.chatMessages.forEach(o => {
            o.sentAtString = moment(o.sentAt).format('YYYY/MM/DD hh:mm:ss a');
          });
        });
        this.chats = res.data;
        if (res.data.length > 0) {
          this.currentChat = res[0];
        }
      }
    );
  }
  downloadFromLink(path: any) {
    let headers = new HttpHeaders();
    //headers = headers.set('Content-Type', 'application/json');
    var authData = JSON.parse(localStorage.getItem('ls.authorizationData'));
    // console.log(authData);
    if (authData != null) {
      headers = headers.set('Authorization', ` Bearer ${authData.token}`);
    }
    this.http.post(`${environment.baseApiUrl}File/DownloadFiles?filePath=${path}`, { "filePath": path }, { headers: headers, responseType: 'arraybuffer' }).subscribe(data => {
      //this.downloadFile(data);
      let binaryData = [];


      binaryData.push(data);
      let downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: "application/force-download" }));

      downloadLink.setAttribute('download', "attachment." + path.split('.').pop());
      document.body.appendChild(downloadLink);
      downloadLink.click();

    }

    ),//console.log(data),
      error => console.log('Error downloading the file.'),
      () => console.info('OK fownload file request complete');
  }
  downloadFile(data: any) {
    const blob = new Blob([data]);
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }

  resetAttach() {
    this.filePath = null;
    this.attachUploaded = false;
  }
  sendMessage() {
    //alert(this.msg.value);
    this.chatMsg = {
      chatId: this.currentChat.id,
      file: this.filePath,
      hasFile: this.attachUploaded,
      isDeleted: false,
      message: this.msg.value,
      sentAt: new Date(),
      userchatMappingId: this.currentChat.userChatMappings.find(o => o.chatId == this.currentChat.id && o.userId == this.userId).id,
      userChatMapping: this.currentChat.userChatMappings.find(o => o.chatId == this.currentChat.id && o.userId == this.userId),
      userId: this.userId,
      sentAtString: moment(new Date()).format('YYYY/MM/DD hh:mm:ss a')
    };
    this.chatMsg.userChatMapping.userImage = '';
    console.log(this.chatMsg);
    //this.currentChat.chatMessages.push(this.chatMsg);
    this.hubConnection.invoke("sendMessage", this.chatMsg)
      .catch(err => console.log(`error on sending message : ${err}`));
    console.log("message sent");
    this.msg.reset();
    this.attachUploaded = false;

    setTimeout(() => {
      let x = document.getElementById("chat-body");
      //alert(x.scrollHeight);
      x.scrollTo(0, x.scrollHeight);
    }, 500);
    //this.signalRService.sendMessage(this.chatMsg);
    //this.sendMessage(this.chatMsg);
  }
  handleInputChange(e) {
    console.log("input change")
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

    var pattern = /image-*/;
    var reader = new FileReader();

    if (!file.type.match(pattern)) {
      //alert('invalid format');
      return;
    }

    this.loaded = false;

    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    console.log("_handleReaderLoaded")
    var reader = e.target;
    this.imageSrc = reader.result;
    this.filePath = this.imageSrc;
    this.loaded = true;
  }
  handleImageLoad() {
    this.imageLoaded = true;
    this.iconColor = this.overlayColor;
  }
  createChat() {
    let chatMappings: UserChatMappingDto[] = [];
    let userChatMapping: UserChatMappingDto = {
      isAdmin: true,
      chatSeen: false,
      isDeleted: false,
      userId: this.userId,
    };
    chatMappings.push(userChatMapping);
    this.availableUsers.forEach(el => {
      let userChatMapping: UserChatMappingDto = {
        isAdmin: false,
        chatSeen: false,
        isDeleted: false,
        userId: el.id,
      };
      chatMappings.push(userChatMapping);
    });
    let newChat: ChatDto = {
      //will be filled
      isDeleted: false,
      name: this.chatName,
      picture: this.filePath,
      userChatMappings: chatMappings,

    };

    this.hubConnection.invoke("createChat", newChat)
      .catch(err => console.log(`error on creating chat : ${err}`));
   // location.reload();
  }
  addUserToChat() {
    let newUsers = this.availableUsers.filter(x => !this.chatMaps.some(y => y.userId === x.id));
    let userChatMappings: UserChatMappingDto[] = [];
    newUsers.forEach(item => {
      let ucd: UserChatMappingDto = {};
      ucd.chatId = this.currentChat.id;
      ucd.isAdmin = false;
      ucd.isDeleted = false;
      ucd.userId = item.id;
      ucd.chatSeen = false;
      ucd.lastMessage = null;
      ucd.userImage = '';
      ucd.userName = item.fullName;
      ucd.id = 0;
      console.log(ucd);

      this.hubConnection.invoke("addUserToChat", ucd)
        .catch(err => console.log(`error on adding user : ${err}`));
      console.log("user added");
    });
    this.chatService.getCurrentChatUsers(this.currentChat.id).subscribe({
      next: (r: Result<SystemUser[]>) => this.chatUsers = r.data,
      error: err => console.error(err),
      complete: () => this.update++
    });
    let x = document.getElementById("close-add-user") as HTMLElement;
    x.click();
  }
  removeUser(id: number) {
    if (id == this.userId) {
      var result = confirm("You are about to remove yourself from the chat..Proceed?");
      if (result) {
      } else {
        return;
      }
    }

    let mapID = this.chatMaps.filter(x => x.userId == id)[0].id;
    //alert(mapID);
    this.removeUserFromChat(mapID);
    this.chatUsers = this.chatUsers.filter(x => x.id != id);
    this.update++;
  }

  removeChat(id: number) {
      var result = confirm("Are you sure to delete this chat..Proceed?");
      if (result) {
      } else {
        return;
      }
    
    this.chatService.deleteChat(id).subscribe(
      (result: any) => {
        if (result != null && result != undefined) {
          this.loadingPanel = false;
          this.translateService
            .get('NEDSS.COMMON.DELETED_SUCESSFULLY')
            .subscribe((res: string) => {
              this.userMsg.success(res);
              this.ChatOpended = false;
              this.getAllChats();
            });
        }

      },
      (error) => {
        this.loadingPanel = false;
        this.translateService
          .get('NEDSS.COMMON.DELETED_FAILED')
          .subscribe((res: string) => {
            this.userMsg.error(res);
          });
      }
    );
  }

  removeUserFromChat = (mappingId: number) => {
    this.hubConnection.invoke("removeUserFromChat", this.currentChat.userChatMappings.find(o => o.id == mappingId))
      .catch(err => console.log(`error on removing user : ${err}`));
  }
  public UserConnected = () => {
    this.hubConnection.invoke("UserConnected", this.userId);
  }
  refreshChats() {
    this.chats = this.chats.sort((a, b) => {
      return moment(b.lastActivity).diff(moment(a.lastActivity));
    })
  }
  //public UserDisconnected =(userId:number)=>{
  //this.hubConnection.invoke("UserDisconnected",userId);
  //}
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////// Deleted //////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  FilterAdministrations(govID: any) {
    console.log(govID);
    var x = this.healthAdministration.filter(x => x.governmentID === govID);
    console.log(x);
  }
  FilterInidentSources(adminstrationID: number) {

  }
  getIncidentSources() {
    this.lookupsService.getAllIncidentSourceHospitals().subscribe({
      next: (result: any) => {
        if (result != null && result != undefined && result?.data != undefined) {
          this.incidentSources = result.data;
        }
        this.loadingPanel = false;
      },
      error: (error) => {
        this.loadingPanel = false;
        this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
          this.userMsg.error(res);
        });
      },
      complete: () => this.loadingPanel = false
    });
  }
  getGovernments() {
    this.lookupsService.getAllGovernments().subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.governments = result.data;
      }
      this.loadingPanel = false;
    }, error => {
      this.loadingPanel = false;
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }

  getHealthAdministration() {
    this.lookupsService.getAllHealthAdministrations().subscribe((result: any) => {
      if (result != null && result != undefined) {
        this.healthAdministration = result.data;
      }
      this.loadingPanel = false;
    }, error => {
      this.loadingPanel = false;
      this.translateService.get('NEDSS.COMMON.INTERNAL_SERVER_ERROR').subscribe((res: string) => {
        this.userMsg.error(res);
      });
    });
  }
  uploadFile(files, chatAttach: boolean = false) {
    //alert("hello");
    if (files.length === 0) {
      return;
    }

    let fileToUpload = <File>files[0];
    const formData = new FormData();
    let headers = new HttpHeaders();
    //headers = headers.set('Content-Type', 'application/json');
    var authData = JSON.parse(localStorage.getItem('ls.authorizationData'));
    // console.log(authData);
    if (authData != null) {
      headers = headers.set('Authorization', ` Bearer ${authData.token}`);
    }
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('uploadType', "0");
    this.http.post(`${environment.baseApiUrl}file/Upload`, formData, { reportProgress: true, observe: 'events', headers: headers })
      .subscribe({
        next: (event) => {
          this.filePath =/*environment.baseApiUrl+*/"wwwroot/files/" + fileToUpload.name;
          this.imageUploaded = !chatAttach;
          this.attachUploaded = chatAttach;
        },
        error: (err: HttpErrorResponse) => console.log(err)
      });
  }
  addUsers() {

  }

}
