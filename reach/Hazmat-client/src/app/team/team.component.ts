import { Component, OnInit, ViewChild } from '@angular/core';
import { TeamService } from './team.service';
import { MatTableDataSource } from '@angular/material/table';
import { TeamData, TeamInfo } from './team.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {PeopleService} from '../people/people.service'
import {PeopleData, PeopleInfo} from '../people/people.model'
import { forkJoin } from 'rxjs';
import { NotificationService } from '../shared/notification.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import {TeamDialogComponent} from './team-dialog/team-dialog.component';
import { FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

  constructor(private teamService:TeamService, 
              private peopleService: PeopleService,
              private dialog: MatDialog,
              private notificationService: NotificationService) { }

  dataSource= new MatTableDataSource<TeamInfo>();
  peopleDataSource= new MatTableDataSource<PeopleData>();
  selectedTeam: TeamInfo;
  personToAdd: PeopleData;
  f_firstPanel = false;
  f_secondPanel = false;
  unassignedPeople: any=[];
  personError:string;
  selectPerson = new FormControl();
  roles = new Map();

  displayedColumns: string[] = ['Name', 'Description','People','Actions'];
  displayedPeopleColumns: string[] = ['LastName', 'FirstName', 'Role', 'Actions'];
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.peopleService.getRole().subscribe((data) => {
       for(var i=0;i<data.length;i++){
          this.roles.set(data[i].RoleID,data[i].Name)
       }
       console.log('roles==='+this.roles.size)
    });
    
    this.f_firstPanel = true;
    this.getTeam();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getUnassignedPeople();
  }

  getTeam(){
    forkJoin([
      this.teamService.getTeam(),
      this.peopleService.getPerson(), 
      this.peopleService.getRole(),
    ]).subscribe(
      (data) =>{ 
        if(data.length > 0) { 
          let teamInfoData = [] 
          let Team: any = data[0];
          let People: any = data[1];     
          Team.map((team, index) => {
            teamInfoData.push({
              TeamID: team.TeamID ? team.TeamID : '',
              Name: team.Name ? team.Name : '',
              Description : team.Description ? team.Description : '',
              People : this.getPeopleDetails(People,team.TeamID),
              Status : team.Status ? team.Status : '',
            })
          })
          this.dataSource.data =teamInfoData;
      }
    },
    error => {
      console.log('error', error)
    }
  );
  }

  addCrew() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    const dialogRef = this.dialog.open(TeamDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result.event === 'New') {
        let teamInfo: TeamInfo;
        teamInfo = result.data;
        this.dataSource.data.push(teamInfo);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  updateCrew(teamInfo: TeamInfo){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    dialogConfig.data = teamInfo;
    const dialogRef = this.dialog.open(TeamDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result.event ==='Edit'){
        let teamInfo: TeamInfo;
        teamInfo = result.data;
        let index = this.dataSource.data.findIndex( e=> e.TeamID === teamInfo.TeamID)
        this.dataSource.data[index] = teamInfo;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      });
  }

  deleteCrew(id: TeamInfo) {
    if (id.People.length == 0 || id.People == null ){
      var displaymessage: string = 'Are you sure you want to remove this crew?';
      let teamData = id as unknown as TeamData;
      this.openDialog(displaymessage, id);
    }
    else {
      var displaymessage: string = 'Crew cannot be removed. There are people assigned to crew.';
      this.notificationService.error(displaymessage);
    }
  }

  openDialog(message: string, id: TeamData): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '50rem',
      data: {message: message}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result.event);
      if(result.event === 'Remove') {
        this.teamService.deleteCrew(id).subscribe(
          (data)=>{
            this.dataSource.data = this.dataSource.data.filter(item => item.TeamID!=id.TeamID)              
            this.notificationService.success('Successfully Deleted');
          },
          error => {
            console.log('error', error);
            this.notificationService.error('Error occurred while deleting the crew');
        });
        }
        else if (result.event === 'Cancel'){
          this.notificationService.warn('Operation Cancelled');
        }
    });
  }

  getPeopleDetails(People:any,TeamID:any){
    let people:string[] = People.filter((person) => (person.TeamID === TeamID))
    // .map(per => per)
    return people;
  }
  getUnassignedPeople(){
    this.peopleService.getUnassignedPeople().subscribe((data) => {
      this.unassignedPeople = data
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  assignCrew(team: TeamInfo) {
    this.selectedTeam = team;
    this.f_firstPanel = false;
    this.f_secondPanel = true;
    this.peopleDataSource.data = this.selectedTeam.People;
  }

  finishEdit() {
    this.f_firstPanel = true;
    this.f_secondPanel = false;
    let index = this.dataSource.data.findIndex( e=> e.TeamID === this.selectedTeam.TeamID)
    this.dataSource.data[index] = this.selectedTeam;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.selectedTeam = null;
  }

  findIndexofTeam(): number {
    const index = this.dataSource.data.findIndex(t => t.TeamID === this.selectedTeam.TeamID);
    return index;
  }
  addPerson(){
    if(!this.personToAdd || !this.personToAdd.PersonID ){
      this.notificationService.warn('Select the Person to add.')
    }
    else{
      this.personToAdd.TeamID = this.selectedTeam.TeamID
      this.peopleService.editPerson(this.personToAdd)
      .subscribe((data)=>{
        this.notificationService.success('Assigned '+this.personToAdd.FirstName+' '+this.personToAdd.LastName+' to the crew successfully');
        this.selectedTeam.People.push(this.personToAdd)
        this.peopleDataSource.data = this.selectedTeam.People
        this.personToAdd= new PeopleData()
        this.getUnassignedPeople()      
    },
      error => {
        this.notificationService.error('Problem occured while assigning the person. Please contact the administrator.')
      });
    }
    
  }
  
  unassignPerson(person: PeopleData){
    person.TeamID = null;    
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '50rem',
      data: { message: 'Are you sure of unassigning the person "'+person.LastName+'" from the crew?' }
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result.event === 'Remove') {
        this.peopleService.editPerson(person).subscribe((data)=>{
          this.notificationService.success(person.LastName+' has been successfully unassigned from the crew.');
          this.peopleDataSource.data = this.peopleDataSource.data.filter(item => item.PersonID!=person.PersonID) 
          this.selectedTeam.People = this.peopleDataSource.data
          this.getUnassignedPeople();
        },
        error => {
          this.notificationService.error('Error occured while unassigning '+person.LastName+' from the crew. Please contact the system administrator.');
        });
      }
      else if (result.event === 'Cancel') {
        this.notificationService.warn('Operation Cancelled');
      }
    });
  }

}


