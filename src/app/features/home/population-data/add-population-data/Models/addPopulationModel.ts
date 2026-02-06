export class AddPopulationModel {
  id?:number=0;
  year?:number;
  governmentID?:number;
  healthAdministrationID?:number;
  incidentSourceID?:number;
  increaseRate?:number=0;
  ageLowerThanMonth?:number=0;
  ageLowerThanYear?:number=0;
  ageUpTo5?:number=0;
  ageUpTo15?:number=0;
  ageUpTo35?:number=0;
  ageUpTo65?:number=0;
  ageMoreThan65?:number=0;
  maleCount?:number=0;
  femalCount?:number=0;
  totalCount?:number=0;
}
