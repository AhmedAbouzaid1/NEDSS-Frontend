export class PopulationDto {
   id?: number;
   year?: number;
   governmentID?: number;
   governmentName?: string;
   healthAdministrationID?: number;
   healthAdministrationName?: string;
   incidentSourceID?: number;
   incidentSourceName?: string;
   increaseRate?: number;
   ageLowerThanMonth?: number;
   ageLowerThanYear?: number;
   ageUpTo5?: number;
   ageUpTo15?: number;
   ageUpTo35?: number;
   ageUpTo65?: number;
   ageMoreThan65?: number;
   maleCount?: number;
   femalCount?: number;
   totalCount?: number;
}
