export class PopulationSearchDto {
  pageSize?: number;
  pageIndex?: number;
  sortColumn?: string;
  sortOrder?: string;
  searchText?: string;
  id?: number;
  year?: number;
  governmentID?: number;
  healthAdministrationID?: number;
  incidentSourceID?: number;
}
