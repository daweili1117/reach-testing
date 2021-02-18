import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardDataService } from '../dashboard-data.service';

export interface MemberStats {
  hr: number;
  bp: string;
  heatIndex: number;
  spO2: number;
  resp: number;
}

const MEMBER_DATA: MemberStats[] = [
  {hr: 60, bp: '143/89', heatIndex: 89, spO2: 99, resp: 40}
]

@Component({
  selector: 'app-dashboard-team-members',
  templateUrl: './dashboard-team-members.component.html',
  styleUrls: ['./dashboard-team-members.component.scss']
})
export class DashboardTeamMembersComponent implements OnInit {

  displayedColumns: string[] = ['hr', 'bp', 'heatIndex', 'spO2', 'resp'];
  memberStats = new MatTableDataSource(MEMBER_DATA);
  team: any = {};

  constructor(private dashboardDataService: DashboardDataService) { 
    this.dashboardDataService.dashboardObj$.subscribe(
      data => {
        this.team = data;
        this.displayName(this.team.crew)
        setInterval(()=>{
          this.displayName(this.team.crew)
        },30000)
        
      }
    )
    
  }

  ngOnInit(): void {
    //this.displayName('krishna on it')
  }

  displayName(crew:any)
  {
    crew.forEach(member => {
      var dt = new Date()
      member.ElapsedCheckOutTimer = '--:--'
      member.ElapsedCheckInTimer = '--:--'
      if(member.CheckOutTime){
        dt = new Date(member.CheckOutTime)
        var current = new Date()
        var diff = (current.getTime()-dt.getTime());
        var days = Math.floor(diff / (60 * 60 * 24 * 1000));
        var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
        var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
        var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
        member.ElapsedCheckOutTimer = hours+':'+minutes
      }
      if(member.CheckInTime){
        var checkin = new Date(member.CheckInTime)
        var diff = (dt.getTime()-checkin.getTime());
        var days = Math.floor(diff / (60 * 60 * 24 * 1000));
        var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
        var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
        var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
        member.ElapsedCheckInTimer = hours+':'+minutes
      }
    // alert(member.Timer)
    });
    // if(crew[0].CheckInTime){
      // var dt = new Date()
    //   var checkin = new Date(crew[0].CheckInTime)
    //   alert(checkin.getTime() - dt.getTime())
    // }
    
  }
}
