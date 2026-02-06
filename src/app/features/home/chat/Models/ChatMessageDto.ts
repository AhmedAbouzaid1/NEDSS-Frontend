import { UserChatMappingDto } from "./UserChatMappingDto";

export class ChatMessageDto{
  id?:number;
  message?:string;
  sentAt?:Date;
  sentAtString:string;
  hasFile?:boolean;
  file?:string;
  userchatMappingId?:number;
  isDeleted?:boolean;
  chatId?:number;
  userId?:number;
  userChatMapping?:UserChatMappingDto;
}
