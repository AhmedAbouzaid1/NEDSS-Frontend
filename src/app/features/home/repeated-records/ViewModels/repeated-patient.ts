import { PatientDiseasesGroup } from "./patient-diseases-group";

export interface RepeatedPatient {
    "id": number,
    "firstName": string,
    "secondName": string,
    "thirdName": string,
    "familyName": string,
    "caseDiscoveryDate": Date,
    "address": string,
    "nationalId": string,
    "homeGovernmentId": number,
    "homeGovernmentName": string,
    "homeHealthAdministrationId": number,
    "homeHealthAdministrationName": string,
    "homeHealthOfficeId": number,
    "homeHealthOfficeName": string,
    "age": number,
    "ageTypeId": number,
    "ageTypeName": string,
    "patientDiseasesGroups": PatientDiseasesGroup[],
    "repeatedPatientsIds": number[],
    "totalCount": number
}
