import { ChatMessageDto } from "./ChatMessageDto";
import {  UserChatMappingDto } from "./UserChatMappingDto";

export interface ChatDto{
  id?:number;
  name?:string;
  picture?:string;
  pictureBase64?:string;
  createdAt?:Date;
  lastActivity?:Date;
  isDeleted?:boolean;
  chatMessages?:ChatMessageDto[];
  userChatMappings?:UserChatMappingDto[];
}
