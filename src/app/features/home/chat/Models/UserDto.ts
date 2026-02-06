import { GovernmentModel } from "../../dashboard/components/codes/models";

export class UserDto {
  id?: number;
  name?: string;
  profilePic?: string;
  profilePicBase64?: string;
  isSelected?: boolean = false;
}

export interface SystemUser {
  id?: number;
  identityUserId?: string;
  userGroupId?: number;
  roleId?: number;
  govenmentId?: number;
  healthAdministrationId?: number;
  incidentSourceId?: number;
  positionId?: number;
  departmentId?: number;
  fullName?: string;
  phoneNo?: string;
  email?: string;
  userName?: string;
  address?: string;
  signalRConectionId?: number;
  userTypeId?: number;
  levelId?: number;
  organizationId?: number;
  externalLabId?: number;
  profilePic?: any[];
  externalLab?: any;//LabPlace
  department?: any; //Department
  govenment?: any; //Governmernt
  healthAdministration?: any;//HealthAdministration
  incidentSource?: any; //IncidentSourcepublic
  position?: any; //Position
  role?: any; //Role
  userGroup?: any; //UserGroup
  Notifications?: Notification[];
}
export interface SystemUserDTO {
  id?: number;
  identityUserId?: string;
  userGroupId?: number;
  roleId?: number;
  govenmentId?: number;
  govenmentName?: string;
  healthAdministrationId?: number;
  healthAdministrationName?: string;
  incidentSourceId?: number;
  incidentSourceName?: string;
  positionId?: number;
  positionName?: string;
  departmentId?: number;
  fullName?: string;
  phoneNo?: string;
  email?: string;
  userName?: string;
  signalRConectionId?: number;
  address?: string;
  password?: string;
  userTypeName?: string;
  levelName?: string;
  userTypeId?: number;
  levelId?: number;
  organizationId?: number;
  externalLabId?: number;
  totalCount?: number;
}
export interface SystemUserDataDto {
  id?: number;
  govenmentId?: number;
  govenmentName?: string;
  healthAdministrationId?: number;
  healthAdministrationName?: string;
  incidentSourceId?: number;
  positionId?: number;
  positionName?: string;
  departmentId?: number;
  fullName?: string;
  phoneNo?: string;
  userTypeId?: number;
  userTypeName?: string;
  levelId?: number;
  levelName?: string;
  signalRConectionId?: string;
  totalCount?: number;
  isSelected?: boolean;
  thresholdId?: number;
}
