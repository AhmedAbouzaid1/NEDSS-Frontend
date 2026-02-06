export interface FilterIncidentSources {
    organizationId:number;
    incidentSourcesTypesIds:number[];
    governmentsIds:number[];
    healthAdministrationsIds:number[];
    branchsIds:number[];
    areasIds:number[];
    forSystemUser:boolean;
}
