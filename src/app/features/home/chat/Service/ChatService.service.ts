import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ChatDto } from '../Models/ChatDto';
import { environment } from 'src/environments/environment';
import { catchError, map, of,Observable  } from 'rxjs';
import { SystemUser, UserDto } from '../Models/UserDto';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { Result } from 'src/app/features/Result';
import { UserChatMappingDto } from '../Models/UserChatMappingDto';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private ChatControllerURL: string =
  environment.baseApiUrl + 'Chat/';
constructor(private APIs: BaseAPIService ) { }


  getAllChats()//:Observable<ChatDto[] | null>
  {
    return this.APIs.get(this.ChatControllerURL+"GetMyChats");
  }

  getUsersForChat()//:Observable<UserDto[] | null>
  {
    return this.APIs.get(this.ChatControllerURL+"GetAllUsersAvailableForChat");
  }
  getCurrentChatUsers(chatID: number):Observable<Result<SystemUser[]>>
  {
    return this.APIs.get(this.ChatControllerURL+"GetCurrentChatUsers?chatID="+chatID);
  }
  GetUserChatMappings(chatID: number):Observable<Result<UserChatMappingDto[]>>
  {
    return this.APIs.get(this.ChatControllerURL+"GetUserChatMappings?chatID="+chatID);
  }

  deleteChat(chatId: number) {
    return this.APIs.delete(this.ChatControllerURL + "Delete?chatId=" + chatId);
  }
}
