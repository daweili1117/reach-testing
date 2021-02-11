import { Component, OnInit, Output, EventEmitter, Inject, Optional  } from '@angular/core';
import { PeopleService } from '../people.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PeopleData, PeopleInfo, Team } from '../people.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RestheaderService } from 'src/app/restheader.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, forkJoin } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '../../shared/notification.service';


import { DevicesService } from '../../devices/devices.service';
import { TeamService } from '../../team/team.service';
import { BloodPressureService } from '../../threshold/blood-pressure/blood-pressure.service';
import { HeartRateService } from '../../threshold/heart-rate/heart-rate.service';
import { HeatIndexService } from '../../threshold/heat-index/heat-index.service';
import { OxygenService } from '../../threshold/oxygen/oxygen.service';
import { disable } from '@rxweb/reactive-form-validators';

export interface Select {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-people-add',
  templateUrl: './people-add.component.html',
  styleUrls: ['./people-add.component.scss']
})


export class PeopleAddComponent implements OnInit {
  editPeople: PeopleInfo;
  action: string;
  ImageUrl: File;

  constructor(private peopleService: PeopleService, 
              private httpClient: HttpClient, 
              private restHeaderService: RestheaderService,
              public dialogRef: MatDialogRef<PeopleAddComponent>,
              private notificationService: NotificationService,
              private devicesService: DevicesService, 
              private teamService: TeamService,
              private bloodpressureService: BloodPressureService,
              private heartrateService: HeartRateService,
              private heatindexService: HeatIndexService,
              private oxygenService: OxygenService,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: PeopleInfo
  ) {
    this.editPeople = { ...data }
    if (this.editPeople.PersonID == null) {
      this.action = 'New';
    }
    else {
      this.action = 'Edit';
    }
    console.log('data==='+data)
  }
  
  roles: any = [];
  teams: any = [];
  devices: any = [];
  selectedTeam: any;
  serverErrors: any =[];
  HRIndexes: any = [];
  BPIndexes: any = [];
  SPIndexes: any = [];
  HIIndexes: any = [];

  peopleFormGroup: FormGroup;
  ngOnInit() {
    
      if(this.action =='Edit'){
        this.peopleFormGroup = new FormGroup({
          PersonID: new FormControl(this.editPeople.PersonID),
          TeamID: this.editPeople.Status == 'Unavailable'? new FormControl({value:this.editPeople.TeamID, disabled:true}):new FormControl(this.editPeople.TeamID),
          FirstName: new FormControl(this.editPeople.FirstName, [Validators.required]),
          LastName: new FormControl(this.editPeople.LastName, [Validators.required]),
          RoleID: new FormControl(this.editPeople.RoleID),
          ImageUrl: new FormControl(this.editPeople.ImageUrl),
          HeartRateID: new FormControl(this.editPeople.HeartRateID),
          BloodPressureID: new FormControl(this.editPeople.BloodPressureID),
          HeatIndexID: new FormControl(this.editPeople.HeatIndexID),
          SpO2ID: new FormControl(this.editPeople.SpO2ID),
        });
        this.peopleFormGroup.controls.TeamID.setValue(this.editPeople.TeamID);
        this.peopleFormGroup.controls.HeartRateID.setValue(this.editPeople.HeartRateID);
        this.peopleFormGroup.controls.BloodPressureID.setValue(this.editPeople.BloodPressureID);
        this.peopleFormGroup.controls.HeatIndexID.setValue(this.editPeople.HeatIndexID);
        this.peopleFormGroup.controls.SpO2ID.setValue(this.editPeople.SpO2ID);
      }
      else{
        this.peopleFormGroup = new FormGroup({
        PersonID: new FormControl(''),
        TeamID: new FormControl(''),
        FirstName: new FormControl('', [Validators.required]),
        LastName: new FormControl('', [Validators.required]),
        RoleID: new FormControl(''),
        ImageUrl: new FormControl(''),
        HeartRateID: new FormControl(''),
        BloodPressureID: new FormControl(''),
        HeatIndexID: new FormControl(''),
        SpO2ID: new FormControl(''),
    });
  }
    this.teamService.getTeam().subscribe((data) => {
      this.teams = data.reduce((a, b) => {
        let t = { "value": b.TeamID, "viewValue": b.Name }
        a.push(t)
        return a;
      }, []); 
    });
    this.peopleService.getRole().subscribe((data) => {
      this.roles = data.reduce((a, b) => {
        let t = { "value": b.RoleID, "viewValue": b.Name }
        a.push(t)
        return a;
      }, []);
    });
    this.devicesService.getDevicesData().subscribe((data) => {
      this.devices = data.reduce((a, b) => {
        let t = { "value": b.DevicePK, "viewValue": b.DeviceID }
        a.push(t)
        return a;
      }, []);
    });
    this.heartrateService.getHeartRate().subscribe((data) => {
      this.HRIndexes = data.reduce((a, b) => {
        let t = { "value": b.HeartRateID, "viewValue": b.HRIndex }
        a.push(t)
        return a;
      }, []);
    });
    this.bloodpressureService.getBloodPressure().subscribe((data) => {
      this.BPIndexes = data.reduce((a, b) => {
        let t = { "value": b.BloodPressureID, "viewValue": b.BPIndex }
        a.push(t)
        return a;
      }, []);
    });
    this.oxygenService.getOxygenData().subscribe((data) => {
      this.SPIndexes = data.reduce((a, b) => {
        let t = { "value": b.SpO2ID, "viewValue": b.SpO2Index }
        a.push(t)
        return a;
      }, []);
    });

    this.heatindexService.getHeatIndex().subscribe((data) => {
      this.HIIndexes = data.reduce((a, b) => {
        let t = { "value": b.HeatIndexID, "viewValue": b.HIIndex }
        a.push(t)
        return a;
      }, []);
    });
    
  }

onImageChanged(event) {

  if (event.target.files.length > 0) {
    const file = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file)
    const peopleFormGroup = this.peopleFormGroup
    const editPeople = this.editPeople
    reader.onload = function () {
      console.log(reader.result);//base64encoded string
      peopleFormGroup.patchValue({
        ImageUrl: reader.result
      });
      editPeople.ImageUrl = reader.result
    };

  }
}

savePerson(person: PeopleData) {
  console.log('person=='+JSON.stringify(person))
  if (person.ImageUrl == '') {
    person.ImageUrl = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";
  }
  
  if(this.action == 'Edit'){
    this.peopleService.editPerson(person)
    .subscribe((data)=>{
      let personData:PeopleInfo = this.getPersonData(data,person);
      if(personData.TeamID){
        let team:any = this.teams.find((t) => (t.value ===personData.TeamID)) 
        if(team) 
          personData.Status=team.viewValue;
      }
      this.notificationService.success(' Person updated successfully');
      this.dialogRef.close({event:this.action,data:personData});
    },
    error => {
      this.throwErrors(error);
    });
  }
  else{
  this.peopleService.addPerson(person)
  .subscribe((data)=>{
    let personData:PeopleInfo = this.getPersonData(data,person);
    if(personData.TeamID){
      let team:any = this.teams.find((t) => (t.value ===personData.TeamID)) 
      if(team) 
        personData.Status=team.viewValue;
    }
    this.notificationService.success(' Person added successfully');
    this.dialogRef.close({event:this.action,data:personData});
  },
  error => {
    this.throwErrors(error);
  });
}
 
}
getPersonData(data:any,person: PeopleData):PeopleInfo{
  let personData:PeopleInfo =  data as unknown as PeopleInfo ; 
    if(person.TeamID){ 
      let team:any = this.teams.find((team) => (team.value ===data.TeamID)) 
      if(team) 
      personData.Team=team.viewValue;
    }
    if (person.RoleID) {
      let role: any = this.roles.find((role) => (role.value === data.RoleID))
      if (role)
        personData.Role = role.viewValue;
    }
    if(person.HeartRateID){ 
      let hr:any = this.HRIndexes.find((hr) => (hr.value ===data.HeartRateID)) 
      if(hr) 
      personData.HeartRate=hr.viewValue;
    }
    if(person.BloodPressureID){ 
      let bp:any = this.BPIndexes.find((bp) => (bp.value ===data.BloodPressureID)) 
      if(bp) 
      personData.BloodPressure=bp.viewValue;
    }
    if(person.HeatIndexID){ 
      let hi:any = this.HIIndexes.find((hi) => (hi.value ===data.HeatIndexID)) 
      if(hi) 
      personData.HeatIndex=hi.viewValue;
    }
    if(person.SpO2ID){ 
      let sp:any = this.SPIndexes.find((sp) => (sp.value ===data.SpO2ID)) 
      if(sp) 
      personData.SpO2=sp.viewValue;
    }
    return personData;
}
throwErrors(error: any){
  this.serverErrors = [];
      let errors= [];
      const frmGroup = this.peopleFormGroup;
      Object.keys(error).map(function(key){
        if(key=='error'){
          let err:object = error[key];
          Object.keys(err).map(function(key){
            const formControl = frmGroup.get(key);

            if (formControl) {
              let msg = '';
              if(!msg){
                err[key].forEach(element => {
                  msg = element;
                });
              }
              formControl.setErrors({
                fieldError: msg
              });
            }
            else{
              err[key].forEach(element => {
                errors.push(element);
              });
            }
          })
        }
      })
      this.serverErrors = this.serverErrors.concat(errors);
}

  cancelPerson() {
    this.notificationService.warn('Operation Cancelled');
    this.dialogRef.close({event:''});
  }

}
