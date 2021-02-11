import { Component, OnInit, Output, EventEmitter, Inject, Optional } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { RestheaderService } from 'src/app/restheader.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { TeamData, TeamInfo } from '../team.model';
import { TeamService } from '../team.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '../../shared/notification.service';
import { PeopleService } from '../../people/people.service';
import { invalid } from '@angular/compiler/src/render3/view/util';

export interface Select {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-team-dialog',
  templateUrl: './team-dialog.component.html',
  styleUrls: ['./team-dialog.component.scss']
})
export class TeamDialogComponent implements OnInit {
  editCrew: TeamInfo;
  action: string;

  constructor(private teamService: TeamService,
    private httpClient: HttpClient,
    private restHeaderService: RestheaderService,
    public dialogRef: MatDialogRef<TeamDialogComponent>,
    private notificationService: NotificationService,
    private peopleService: PeopleService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: TeamInfo) {
      this.editCrew = {...data}
      if(this.editCrew.TeamID == null){
        this.action = 'New';
      }
      else{
        this.action = 'Edit';
      }
     }

  serverErrors: any =[];
  persons: any = [];
  teamFormGroup: FormGroup;

  ngOnInit(): void {
    if(this.action =='Edit'){
      this.teamFormGroup = new FormGroup({
        TeamID: new FormControl(this.editCrew.TeamID),
        Name: new FormControl(this.editCrew.Name, [Validators.required]),
        Description: new FormControl(this.editCrew.Description, [Validators.required]),
        Status: new FormControl(this.editCrew.Status, [Validators.required])
      });      
    }
    else {
      this.teamFormGroup = new FormGroup({
        TeamID: new FormControl(null),
        Name: new FormControl('', [Validators.required]),
        Description: new FormControl('', [Validators.required]),
        Status: new FormControl('true', [Validators.required])
      });
    }
    this.peopleService.getPerson().subscribe((data) => {
      this.persons = data; 
    });
    
  }

  saveCrew(teamData: TeamData){
    if(this.action == 'Edit'){
      this.teamService.editCrew(teamData)
      .subscribe((data)=>{
        let teamInfo:TeamInfo =  data as unknown as TeamInfo;
        let persons_crew: [] = this.persons.filter(person=>person.TeamID === teamInfo.TeamID);
        teamInfo.People = persons_crew;
        this.notificationService.success(' Team updated successfully');
        this.dialogRef.close({event:this.action,data:teamInfo});
      },
      error => {
        console.log(error)
        this.throwErrors(error);
      });
    }
    else{
      this.teamService.addCrew(teamData)
      .subscribe((data)=>{
        let teamInfo:TeamInfo =  data as unknown as TeamInfo; 
        let persons_crew: [] = this.persons.filter(person=>person.TeamID === teamInfo.TeamID);
        teamInfo.People = persons_crew;
        console.log(teamInfo);
        this.notificationService.success(' Team added successfully');
        this.dialogRef.close({event:this.action,data:teamInfo});
      },
      error => {
        console.log(error)
        this.throwErrors(error);
      });
    }
  }

  throwErrors(error: any){
    this.serverErrors = [];
        let errors= [];
        const frmGroup = this.teamFormGroup;
        Object.keys(error).map(function(key){
          if(key=='error'){
            let err:object = error[key];
            Object.keys(err).map(function(key){
              const formControl = frmGroup.get(key);

              if (formControl) {
                // activate the error message
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

  cancelCrew() {
    this.notificationService.warn('Operation Cancelled');
    this.dialogRef.close({event:''});
  }

}
