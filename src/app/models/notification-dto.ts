import { SystemUserDTO } from "../features/home/chat/Models/UserDto";

export interface NotificationDTO {
  id?: number;
  title?: string;
  hasUrl?: boolean;
  url?: string;
  message?: string;
  createdDate?: Date;
  systemUserId?: number;
  user?: SystemUserDTO;
  seen?: boolean;
  chatId?: number;
}
