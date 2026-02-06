import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SystemUser } from '../Models/UserDto';
import { DefaultImage } from 'src/app/core/constants';

@Component({
  selector: 'app-chat-users',
  templateUrl: './chat-users.component.html',
  styleUrls: ['./chat-users.component.css']
})
export class ChatUsersComponent {
  @Input() update: number = -1;
  @Input() users: SystemUser[] = [];
  @Output() userID = new EventEmitter<number>();

  defaultImage = DefaultImage;
  deleteUser(id: number) {
    this.userID.emit(id);
  }
}
