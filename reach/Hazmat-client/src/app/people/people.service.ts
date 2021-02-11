import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestheaderService } from '../restheader.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PeopleData, PeopleInfo, Team,Role, HeartRate, BloodPressure, DevicesData, HeatIndexDetails, OxygenData} from './people.model';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor(private httpClient: HttpClient, private restheaderService: RestheaderService) { }

  getPerson(): Observable<PeopleInfo[]> {
    return this.httpClient.get<any>(environment.host + 'person', this.restheaderService.httpheader);
  }

  getUnassignedPeople(): Observable<PeopleInfo[]> {
    return this.httpClient.get<any>(environment.host + 'unassignedpeople', this.restheaderService.httpheader);
  }
  
  getPersonHeartrate(): Observable<HeartRate[]> {
    return this.httpClient.get<any>(environment.host + 'heartrate_json', this.restheaderService.httpheader);

  }

  getPersonBloodpressure(): Observable<BloodPressure[]> {
    return this.httpClient.get<any>(environment.host + 'bloodpressure_json', this.restheaderService.httpheader);

  }

  getPersonHeatIndex(): Observable<HeatIndexDetails[]> {
    return this.httpClient.get<any>(environment.host + 'heatindex_json/', this.restheaderService.httpheader);

  }

  getPersonOxygenData(): Observable<OxygenData[]> {
    return this.httpClient.get<any>(environment.host + 'spo2_json/', this.restheaderService.httpheader);
  }


  getPersonById(id: number): Observable<PeopleData[]> {
    return this.httpClient.get<any>(environment.host + 'person/' + id + '/', this.restheaderService.httpheader);
  }

  getTeam(): Observable<Team[]> {
    return this.httpClient.get<any>(environment.host + 'team_json', this.restheaderService.httpheader);
[]
  }


  getDevicesData(): Observable<DevicesData[]> {
    return this.httpClient.get<any>(environment.host + 'device', this.restheaderService.httpheader);
  }


  

  addPerson(person: PeopleData): Observable<PeopleData> {
    let requestBody = {
      FirstName: person.FirstName,
      LastName: person.LastName,
      RoleID: person.RoleID,
      ImageUrl: person.ImageUrl,
      isDelete: false,
      TeamID: person.TeamID,
      HeartRateID: person.HeartRateID,
      BloodPressureID: person.BloodPressureID,
      HeatIndexID: person.HeatIndexID,
      SpO2ID: person.SpO2ID
    }
    return this.httpClient.post<PeopleData>(environment.host + 'person', requestBody, this.restheaderService.httpheader)
  }
  
  addTeam(person:PeopleData, team:Team):Observable<Team>{
    let requestBody={
      Name:person.TeamID,
      Description:team.Description

    }
    return this.httpClient.post<Team>(environment.host + 'team_json', requestBody, this.restheaderService.httpheader);
  }

  addDevice(device: DevicesData, PersonID: any) {
    let requestBody = {
      DeviceID: device.DeviceID,
      IP: device.IP,
      Description: device.Description,
      Type: device.Type,
      Status: false,
      BatteryStatus: 100,
      isDelete: false,
      PersonID: PersonID
    }
    return this.httpClient.post(environment.host + 'device', requestBody, this.restheaderService.httpheader)
  }

  
  addPersonHeartrate(HeartRate: HeartRate, HRIndex: any) {
    let requestBody = {
      HRIndex: HeartRate.HRIndex
    }
    return this.httpClient.post<any>(environment.host + 'heatindex_json/', requestBody, this.restheaderService.httpheader)
  }


  updatePerson(id: Number, data: Object): Observable<any> {
    return this.httpClient.patch<PeopleData>(environment.host + 'person/' + id + '/', data, this.restheaderService.httpheader)
  }
  
  editPerson(person: PeopleData): Observable<any> {
    let requestBody = {
      FirstName: person.FirstName,
      LastName: person.LastName,
      RoleID: person.RoleID,
      isDelete: false,
      TeamID: person.TeamID,
      HeartRateID: person.HeartRateID,
      BloodPressureID: person.BloodPressureID,
      HeatIndexID: person.HeatIndexID,
      SpO2ID: person.SpO2ID,
      Status: person.Status
    }
    if (person.ImageUrl.length > 0 && !person.ImageUrl.includes('http') && !person.ImageUrl.includes('/media') ) {
      requestBody['ImageUrl'] = person.ImageUrl
    }


    let id = person.PersonID
    return this.httpClient.patch<PeopleData>(environment.host + 'person/' + id + '/', requestBody, this.restheaderService.httpheader)
  }

  

    deletePerson(person: PeopleData): Observable<any> {
    let requestBody = {
      FirstName: person.FirstName,
      LastName: person.LastName,
      RoleID: person.RoleID,
      
    }
    let id = person.PersonID
    return this.httpClient.delete<any>(environment.host + 'person/' + id + '/',this.restheaderService.httpheader)
  }

  getRole(): Observable<Role[]> {
    return this.httpClient.get<any>(environment.host + 'role_json', this.restheaderService.httpheader);
  }

}

