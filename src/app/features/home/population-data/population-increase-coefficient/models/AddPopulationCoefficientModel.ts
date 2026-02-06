export class AddPopulationCoefficientModel {
  id?: number=0;
  increaseRate?: number;
  ageLowerThanMonth?:number;
  ageLowerThanYear?: number;
  ageUpTo5?: number;
  ageUpTo15?: number;
  ageUpTo35?: number;
  ageUpTo65?: number;
  ageMoreThan65?: number;
  maleCount?: number;
  femalCount?: number;
  governmentID?: number;
  healthAdministrationID?: number;
  incidentSourceID?: number;
  totalCount?: number;
}
