import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestheaderService } from '../restheader.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TeamData } from './team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

 
  constructor(private httpClient: HttpClient, private restheaderService: RestheaderService) { }
  
  getTeam(): Observable<TeamData[]>{
    return this.httpClient.get<any>(environment.host + 'team_json', this.restheaderService.httpheader);

  }

  addCrew(teamData: TeamData){
    let requestBody = {
      TeamID: teamData.TeamID,
      Name: teamData.Name,
      Description: teamData.Description,
      Status: teamData.Status
    }
    return this.httpClient.post(environment.host + 'team_json', requestBody, this.restheaderService.httpheader)    
  }
  
  editCrew(teamData: TeamData){
    let requestBody = {
      Name: teamData.Name,
      Description: teamData.Description,
      Status: teamData.Status  
    }
    let id = teamData.TeamID;
    return this.httpClient.put<TeamData>(environment.host + 'team_json/' + id + '/', requestBody, this.restheaderService.httpheader)
  }

  deleteCrew(teamData: TeamData): Observable<any>{
    let requestBody = {
      Name: teamData.Name,
      Description: teamData.Description,
      Status: teamData.Status 
    }
    let id = teamData.TeamID;
    return this.httpClient.delete<any>(environment.host + 'team_json/' + id + '/', this.restheaderService.httpheader)
  }
  
  }

