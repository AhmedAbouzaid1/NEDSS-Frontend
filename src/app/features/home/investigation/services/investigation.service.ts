import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseAPIService } from 'src/app/core/services/BaseAPI.service';
import { environment } from 'src/environments/environment';
import { PatientModel } from '../../general-data/models/patient-model';

@Injectable({
  providedIn: 'root',
})
export class InvestigationService {
  patientDiseases = [];
  patient: PatientModel = new PatientModel;
  currentid;
  diseaseGroupID: number = 0
  view: boolean = true;
  constructor(private APIs: BaseAPIService) { }
  private controllerURL: string = environment.baseApiUrl + "InvistigationForms/";

  addInvestigation(ivestigation: any) {
    return this.APIs.post(this.controllerURL + 'AddBirdFlu', ivestigation);
  }
  update(ivestigation: any) {
    return this.APIs.update(this.controllerURL + 'UpdateBirdFlu', ivestigation);
  }
  getById(id: any) {
    return this.APIs.get(this.controllerURL + 'GetBirdFluById?id=' + id);
  }
  addInvestigationMalaria(ivestigation: any) {
    return this.APIs.post(this.controllerURL + 'AddMalaria', ivestigation);
  }
  updateMalaria(ivestigation: any) {
    return this.APIs.update(this.controllerURL + 'UpdateMalaria', ivestigation);
  }
  getByIdMalaria(id: any) {
    return this.APIs.get(this.controllerURL + 'GetMalariaByPatientId?id=' + id);
  }
  ///Diphtheria
  addInvestigationDiphtheria(ivestigation: any) {
    return this.APIs.post(this.controllerURL + 'AddIDiphtheria', ivestigation);
  }
  updateDiphtheria(ivestigation: any) {
    return this.APIs.update(
      this.controllerURL + 'UpdateIDiphtheria',
      ivestigation
    );
  }
  getByIdDiphtheria(id: any) {
    return this.APIs.get(this.controllerURL + 'GetIDiphtheriaById?id=' + id);
  }
  //Rabies
  addInvestigationRabies(ivestigation: any) {
    return this.APIs.post(this.controllerURL + 'AddRabies', ivestigation);
  }
  updateRabies(ivestigation: any) {
    return this.APIs.update(this.controllerURL + 'UpdateRabies', ivestigation);
  }
  getByIdRabies(id: any) {
    return this.APIs.get(this.controllerURL + 'GetRabiesById?id=' + id);
  }

  //Brucella
  addInvestigationBrucella(ivestigation: any) {
    return this.APIs.post(this.controllerURL + 'AddBrucella', ivestigation);
  }
  updateBrucella(ivestigation: any) {
    return this.APIs.update(
      this.controllerURL + 'UpdateBrucella',
      ivestigation
    );
  }
  getByIdBrucella(id: any) {
    return this.APIs.get(
      this.controllerURL + 'GetBrucellaByPatientId?id=' + id
    );
  }
  //////////FeverRash
  addInvestigationFeverRash(ivestigation: any) {
    return this.APIs.post(this.controllerURL + 'AddFeverRash', ivestigation);
  }
  updateFeverRash(ivestigation: any) {
    return this.APIs.update(
      this.controllerURL + 'UpdateFeverRash',
      ivestigation
    );
  }
  getByIdFeverRash(id: any) {
    return this.APIs.get(
      this.controllerURL + 'GetFeverRashByPatientId?id=' + id
    );
  }
  //WhoopingCough
  addInvestigationWhoopingCough(ivestigation: any) {
    return this.APIs.post(
      this.controllerURL + 'AddWhoopingCough',
      ivestigation
    );
  }
  updateWhoopingCough(ivestigation: any) {
    return this.APIs.update(
      this.controllerURL + 'UpdateWhoopingCough',
      ivestigation
    );
  }
  getByIdWhoopingCough(id: any) {
    return this.APIs.get(
      this.controllerURL + 'GetWhoopingCoughPatientId?id=' + id
    );
  }
  //RiftValley
  addInvestigationRiftValley(ivestigation: any) {
    return this.APIs.post(this.controllerURL + 'AddRiftValley', ivestigation);
  }
  updateRiftValley(ivestigation: any) {
    return this.APIs.update(
      this.controllerURL + 'UpdateRiftValley',
      ivestigation
    );
  }
  getByIdRiftValley(id: any) {
    return this.APIs.get(
      this.controllerURL + 'GetRiftValleyPatientId?id=' + id
    );
  }
  //HemorrhagicFever
  addInvestigationHemorrhagicFever(ivestigation: any) {
    return this.APIs.post(
      this.controllerURL + 'AddHemorrhagicFever',
      ivestigation
    );
  }
  updateHemorrhagicFever(ivestigation: any) {
    return this.APIs.update(
      this.controllerURL + 'UpdateHemorrhagicFever',
      ivestigation
    );
  }
  getByIdHemorrhagicFever(id: any) {
    return this.APIs.get(
      this.controllerURL + 'GetHemorrhagicFeverByPatientId?id=' + id
    );
  }
  //SchistosomiasisFasciola
  addInvestigationSchistosomiasisFasciola(ivestigation: any) {
    return this.APIs.post(
      this.controllerURL + 'AddSchistosomiasisFasciola',
      ivestigation
    );
  }
  updateSchistosomiasisFasciola(ivestigation: any) {
    return this.APIs.update(
      this.controllerURL + 'UpdateSchistosomiasisFasciola',
      ivestigation
    );
  }
  getByIdSchistosomiasisFasciola(id: any, diseaseGroupId: number) {
    return this.APIs.get(
      this.controllerURL + 'GetSchistosomiasisFasciolaByPatientId?id=' + id + '&diseaseGroupId=' + diseaseGroupId
    );
  }
  //Monkeypox
  addInvestigationMonkeypox(ivestigation: any) {
    return this.APIs.post(this.controllerURL + 'AddMonkeypox', ivestigation);
  }
  updateMonkeypox(ivestigation: any) {
    return this.APIs.update(
      this.controllerURL + 'UpdateMonkeypox',
      ivestigation
    );
  }
  getByIdMonkeypox(id: any) {
    return this.APIs.get(this.controllerURL + 'GetMonkeypoxPatientId?id=' + id);
  }
  //hepatitis
  addInvestigationhepatitis(ivestigation: any) {
    return this.APIs.post(
      this.controllerURL + 'AddHepatitisVirusesDTO',
      ivestigation
    );
  }
  updatehepatitis(ivestigation: any) {
    return this.APIs.update(
      this.controllerURL + 'UpdateHepatitisViruses',
      ivestigation
    );
  }
  getByIdhepatitis(id: any) {
    return this.APIs.get(this.controllerURL + 'GetHepatitisPatientId?id=' + id);
  }
  //typhoid
  addInvestigationtyphoid(ivestigation: any) {
    return this.APIs.post(this.controllerURL + 'AddTyphoid', ivestigation);
  }
  updatetyphoid(ivestigation: any) {
    return this.APIs.update(this.controllerURL + 'UpdateTyphoid', ivestigation);
  }
  getByIdtyphoid(id: any) {
    return this.APIs.get(this.controllerURL + 'GetPatientId?id=' + id);
  }
  //cholera
  addInvestigationcholera(ivestigation: any) {
    return this.APIs.post(this.controllerURL + 'AddCholera', ivestigation);
  }
  updatecholera(ivestigation: any) {
    return this.APIs.update(this.controllerURL + 'UpdateCholera', ivestigation);
  }
  getByIdcholera(id: any) {
    return this.APIs.get(this.controllerURL + 'GetCholeraPatientId?id=' + id);
  }
  //tetanus
  addInvestigationtetanus(ivestigation: any) {
    return this.APIs.post(this.controllerURL + 'AddTetanus', ivestigation);
  }
  updatetetanus(ivestigation: any) {
    return this.APIs.update(this.controllerURL + 'UpdateTetanus', ivestigation);
  }
  getByIdtetanus(id: any) {
    return this.APIs.get(this.controllerURL + 'GetTetanusPatientId?id=' + id);
  }
  //PlagueIllness
  addInvestigationPlague(ivestigation: any) {
    return this.APIs.post(this.controllerURL + 'AddPlagueIllness', ivestigation);
  }
  updatePlague(ivestigation: any) {
    return this.APIs.update(this.controllerURL + 'UpdatePlagueIllness', ivestigation);
  }
  getByIdPlague(id: any) {
    return this.APIs.get(this.controllerURL + 'GetPlagueIllnessByPatientId?id=' + id);
  }
  //FalseChickenpox
  addInvestigationFalseChickenpox(ivestigation: any) {
    return this.APIs.post(
      this.controllerURL + 'AddFalseChickenpox',
      ivestigation
    );
  }
  updateFalseChickenpox(ivestigation: any) {
    return this.APIs.update(
      this.controllerURL + 'UpdateFalseChickenpox',
      ivestigation
    );
  }
  getByIdFalseChickenpox(id: any) {
    return this.APIs.get(
      this.controllerURL + 'GetFalseChickenpoxPatientId?id=' + id
    );
  }
  //SevereFoodPoisoning
  addInvestigationSevereFoodPoisoning(ivestigation: any) {
    return this.APIs.post(
      this.controllerURL + 'AddSevereFoodPoisoning',
      ivestigation
    );
  }
  updateSevereFoodPoisoning(ivestigation: any) {
    return this.APIs.update(
      this.controllerURL + 'UpdateSevereFoodPoisoning',
      ivestigation
    );
  }
  getByIdSevereFoodPoisoning(id: any) {
    return this.APIs.get(
      this.controllerURL + 'GetSevereFoodPoisoningPatientId?id=' + id
    );
  }
  //bLOODYDIARRHEA
  addInvestigationbLOODYDIARRHEA(ivestigation: any) {
    return this.APIs.post(
      this.controllerURL + 'AddBloodyDiarrheaDTO',
      ivestigation
    );
  }
  updateSeverebLOODYDIARRHEA(ivestigation: any) {
    return this.APIs.update(
      this.controllerURL + 'UpdateBloodyDiarrhea',
      ivestigation
    );
  }
  getByIdbLOODYDIARRHEA(id: any) {
    return this.APIs.get(
      this.controllerURL + 'GetBloodyDiarrheaPatientId?id=' + id
    );
  }
  //mumbariPoisoning
  addInvestigationmumbariPoisoning(ivestigation: any) {
    return this.APIs.post(
      this.controllerURL + 'AddmumbariPoisoning',
      ivestigation
    );
  }
  updateSeveremumbariPoisoning(ivestigation: any) {
    return this.APIs.update(
      this.controllerURL + 'UpdatemumbariPoisoning',
      ivestigation
    );
  }
  getByIdmumbariPoisoning(id: any) {
    return this.APIs.get(this.controllerURL + 'GetmumbariPoisoning?id=' + id);
  }
  //Diarrhea
  addInvestigationDiarrhea(ivestigation: any) {
    return this.APIs.post(this.controllerURL + 'AddDiarrhea', ivestigation);
  }
  updateSevereDiarrhea(ivestigation: any) {
    return this.APIs.update(
      this.controllerURL + 'UpdateDiarrhea',
      ivestigation
    );
  }
  getByIdDiarrhea(id: any) {
    return this.APIs.get(this.controllerURL + 'GetDiarrhea?id=' + id);
  }

  //filarisis
  addInvestigationfilarisis(ivestigation: any) {
    return this.APIs.post(this.controllerURL + "AddFilariasis", ivestigation);
  }
  updateSeverefilarisis(ivestigation: any) {
    return this.APIs.update(this.controllerURL + "UpdateFilariasis", ivestigation);
  }
  getByIdfilarisis(id: any) {
    return this.APIs.get(this.controllerURL + "GetFilariasisPatientId?id=" + id);
  }
  //leishmania
  addInvestigationleishmania(ivestigation: any) {
    return this.APIs.post(this.controllerURL + "AddLeishmania", ivestigation);
  }
  updateSevereleishmania(ivestigation: any) {
    return this.APIs.update(this.controllerURL + "UpdateLeishmania", ivestigation);
  }
  getByIdleishmania(id: any, diseaseGroupId: number) {
    return this.APIs.get(this.controllerURL + "GetLeishmaniaPatientId?id=" + id + "&diseaseGroupId=" + diseaseGroupId);
  }
  //leper
  addInvestigationleper(ivestigation: any) {
    return this.APIs.post(this.controllerURL + "AddLeper", ivestigation);
  }
  updateSevereleper(ivestigation: any) {
    return this.APIs.update(this.controllerURL + "UpdateLeper", ivestigation);
  }
  getByIdleper(id: any) {
    return this.APIs.get(this.controllerURL + "GetLeperPatientId?id=" + id);
  }
  //hiv
  addInvestigationhiv(ivestigation: any) {
    return this.APIs.post(this.controllerURL + "AddHiv", ivestigation);
  }
  updateSeverehiv(ivestigation: any) {
    return this.APIs.update(this.controllerURL + "UpdateHiv", ivestigation);
  }
  getByIdhiv(id: any) {
    return this.APIs.get(this.controllerURL + "GetHivPatientId?id=" + id);
  }

  //ari
  addInvestigationari(ivestigation: any) {
    return this.APIs.post(this.controllerURL + "AddAir", ivestigation);
  }
  updateSevereari(ivestigation: any) {
    return this.APIs.update(this.controllerURL + "UpdateAir", ivestigation);
  }
  getByIdari(id: any) {
    return this.APIs.get(this.controllerURL + "GetAirPatientId?id=" + id);
  }
  //Tuberculosis
  addInvestigationTuberculosis(ivestigation: any) {
    return this.APIs.post(this.controllerURL + "AddTuberculosis", ivestigation);
  }
  updateSevereTuberculosis(ivestigation: any) {
    return this.APIs.update(this.controllerURL + "UpdateTuberculosis", ivestigation);
  }
  getByIdTuberculosis(id: any) {
    return this.APIs.get(this.controllerURL + "GetTuberculosis?id=" + id);
  }
  //Meningeal
  addInvestigationMeningeal(ivestigation: any) {
    return this.APIs.post(this.controllerURL + "AddMeningeal", ivestigation);
  }
  updateSevereMeningeal(ivestigation: any) {
    return this.APIs.update(this.controllerURL + "UpdateMeningeal", ivestigation);
  }
  getByIdMeningeal(id: any) {
    return this.APIs.get(this.controllerURL + "GetMeningeal?id=" + id);
  }
  //mers
  addInvestigationmers(ivestigation: any) {
    return this.APIs.post(this.controllerURL + "Addmers", ivestigation);
  }
  updateSeveremers(ivestigation: any) {
    return this.APIs.update(this.controllerURL + "Updatemers", ivestigation);
  }
  getByIdmers(id: any, diseaseGroupId?: number) {
    const query = diseaseGroupId != null
      ? `Getmers?id=${id}&diseaseGroupId=${diseaseGroupId}`
      : `Getmers?id=${id}`;
    return this.APIs.get(this.controllerURL + query);
  }
  //mumbs
  addInvestigationmumbs(ivestigation: any) {
    return this.APIs.post(this.controllerURL + "AddMumps", ivestigation);
  }
  updatemumbs(ivestigation: any) {
    return this.APIs.update(this.controllerURL + "UpdateMumps", ivestigation);
  }
  getByIdmumbs(id: any) {
    return this.APIs.get(this.controllerURL + "GetByPationtId?id=" + id);
  }
  //AcuteFlaccidParalysis
  addInvestigationAcuteFlaccidParalysis(ivestigation: any) {
    return this.APIs.post(this.controllerURL + "AddAcuteFlaccidParalysis", ivestigation);
  }
  updateAcuteFlaccidParalysis(ivestigation: any) {
    return this.APIs.update(this.controllerURL + "UpdateAcuteFlaccidParalysis", ivestigation);
  }
  getByIdAcuteFlaccidParalysis(id: any) {
    return this.APIs.get(this.controllerURL + "GetAcuteFlaccidParalysis?id=" + id);
  }
}
