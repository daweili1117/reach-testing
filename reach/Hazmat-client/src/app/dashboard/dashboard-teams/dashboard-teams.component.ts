import { Component, OnInit } from '@angular/core';
import { DashboardDataService } from '../dashboard-data.service';
import { CrewInfo } from './dashboard-teams.model';
import { element } from 'protractor';
import { createWriteStream } from 'fs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, forkJoin } from 'rxjs';
import { PeopleService } from '../../people/people.service';
import { environment } from 'src/environments/environment';
import { PeopleData } from 'src/app/people/people.model';

@Component({
  selector: 'app-dashboard-teams',
  templateUrl: './dashboard-teams.component.html',
  styleUrls: ['./dashboard-teams.component.scss']
})
export class DashboardTeamsComponent implements OnInit {
  breakpoint: number;
  selectedChip: string;
  selectedTeam: string;
  toggle: false;

  elements = [
    { state: "Danger", value: "danger" },
    { state: "Teams", value: "teams" },
    { state: "All", value: "all"}
  ];

  crews : CrewInfo[];

  // members = [
  //   {
  //     name: 'Truck 1',
  //     crew: 
  //     [
  //       { lName: 'Tomson', fName: 'Dave', battery: 100, time1: '00:33', time2: '00.00', image: "https://golfdigest.sports.sndimg.com/content/dam/images/golfdigest/fullset/2018/03/13/5aa71f038457f845c97ed1f3_Matt-Parziale.jpg.rend.hgtvcom.1850.1321.suffix/1573238222231.jpeg", inDanger: false},
  //       { lName: 'Smith', fName: 'Tim', battery: 75, time1: '00:28', time2: '00.01', image: "https://golfdigest.sports.sndimg.com/content/dam/images/golfdigest/fullset/2018/03/13/5aa71f038457f845c97ed1f3_Matt-Parziale.jpg.rend.hgtvcom.1850.1321.suffix/1573238222231.jpeg", inDanger: false },
  //       { lName: 'Adams', fName: 'Herold', battery: 50, time1: '00:00', time2: '00.22', image: "https://golfdigest.sports.sndimg.com/content/dam/images/golfdigest/fullset/2018/03/13/5aa71f038457f845c97ed1f3_Matt-Parziale.jpg.rend.hgtvcom.1850.1321.suffix/1573238222231.jpeg", inDanger: false},
  //       { lName: 'Olsen', fName: 'Benito', battery: 100, time1: '00:33', time2: '00.00', image: "https://golfdigest.sports.sndimg.com/content/dam/images/golfdigest/fullset/2018/03/13/5aa71f038457f845c97ed1f3_Matt-Parziale.jpg.rend.hgtvcom.1850.1321.suffix/1573238222231.jpeg", inDanger: false},
  //     ]
  //   },
  //   {
  //     name: 'Engine 1',
  //     crew:
  //     [
  //       { lName: 'Beil', fName: 'Nel', battery: 100, time1: '00:33', time2: '00.00', image: "https://www.providentins.com/wp-content/plugins/phastpress/phast.php?service=images&src=https%3A%2F%2Fwww.providentins.com%2Fwp-content%2Fuploads%2F2018%2F11%2FThe-Benefits-of-Becoming-a-Volunteer-Firefighter-e1542385706799.jpg&cacheMarker=1542385706-110224&token=0e83c21d87ae5120", inDanger: true},
  //       { lName: 'Church', fName: 'Carl', battery: 100, time1: '00:33', time2: '00.00', image: "https://www.providentins.com/wp-content/plugins/phastpress/phast.php?service=images&src=https%3A%2F%2Fwww.providentins.com%2Fwp-content%2Fuploads%2F2018%2F11%2FThe-Benefits-of-Becoming-a-Volunteer-Firefighter-e1542385706799.jpg&cacheMarker=1542385706-110224&token=0e83c21d87ae5120", inDanger: true},
  //       { lName: 'Churchil', fName: 'Jaxx', battery: 100, time1: '00:33', time2: '00.00', image: "https://www.providentins.com/wp-content/plugins/phastpress/phast.php?service=images&src=https%3A%2F%2Fwww.providentins.com%2Fwp-content%2Fuploads%2F2018%2F11%2FThe-Benefits-of-Becoming-a-Volunteer-Firefighter-e1542385706799.jpg&cacheMarker=1542385706-110224&token=0e83c21d87ae5120", inDanger: false},
  //       { lName: 'Wickens', fName: 'Rajan', battery: 100, time1: '00:33', time2: '00.00', image: "https://www.providentins.com/wp-content/plugins/phastpress/phast.php?service=images&src=https%3A%2F%2Fwww.providentins.com%2Fwp-content%2Fuploads%2F2018%2F11%2FThe-Benefits-of-Becoming-a-Volunteer-Firefighter-e1542385706799.jpg&cacheMarker=1542385706-110224&token=0e83c21d87ae5120", inDanger: false},
  //       { lName: 'Bate', fName: 'Jaxon', battery: 100, time1: '00:33', time2: '00.00', image: "https://www.providentins.com/wp-content/plugins/phastpress/phast.php?service=images&src=https%3A%2F%2Fwww.providentins.com%2Fwp-content%2Fuploads%2F2018%2F11%2FThe-Benefits-of-Becoming-a-Volunteer-Firefighter-e1542385706799.jpg&cacheMarker=1542385706-110224&token=0e83c21d87ae5120", inDanger: false},
  //       { lName: 'May', fName: 'Rehan', battery: 100, time1: '00:33', time2: '00.00', image: "https://www.providentins.com/wp-content/plugins/phastpress/phast.php?service=images&src=https%3A%2F%2Fwww.providentins.com%2Fwp-content%2Fuploads%2F2018%2F11%2FThe-Benefits-of-Becoming-a-Volunteer-Firefighter-e1542385706799.jpg&cacheMarker=1542385706-110224&token=0e83c21d87ae5120", inDanger: false},
  //       { lName: 'Tang', fName: 'Luna', battery: 100, time1: '00:33', time2: '00.00', image: "https://www.providentins.com/wp-content/plugins/phastpress/phast.php?service=images&src=https%3A%2F%2Fwww.providentins.com%2Fwp-content%2Fuploads%2F2018%2F11%2FThe-Benefits-of-Becoming-a-Volunteer-Firefighter-e1542385706799.jpg&cacheMarker=1542385706-110224&token=0e83c21d87ae5120", inDanger: false},
  //     ]
  //   },
  //   {
  //     name: 'Medic 1',
  //     crew:
  //     [
  //       { lName: 'Ramon', fName: 'Don', battery: 100, time1: '00:33', time2: '00.00', image: "https://www.safetybydesigninc.com/wp-content/uploads/2019/01/emt-paramedic-medic-staffing-texas.jpg", inDanger: false},
  //       { lName: 'Notham', fName: 'Troy', battery: 100, time1: '00:33', time2: '00.00', image: "https://www.safetybydesigninc.com/wp-content/uploads/2019/01/emt-paramedic-medic-staffing-texas.jpg", inDanger: false},
  //       { lName: 'West', fName: 'Mitch', battery: 100, time1: '00:33', time2: '00.00', image: "https://www.safetybydesigninc.com/wp-content/uploads/2019/01/emt-paramedic-medic-staffing-texas.jpg", inDanger: false},
  //       { lName: 'East', fName: 'Nigel', battery: 100, time1: '00:33', time2: '00.00', image: "https://www.safetybydesigninc.com/wp-content/uploads/2019/01/emt-paramedic-medic-staffing-texas.jpg", inDanger: false}
  //     ]
  //   },
  //   {
  //     name: 'Rescue 1',
  //     crew:
  //     [
  //       { lName: 'Drao', fName: 'Talor', battery: 100, time1: '00:33', time2: '00.00', image: "https://advancelocal-adapter-image-uploads.s3.amazonaws.com/image.nj.com/home/njo-media/width2048/img/centraljersey_impact/photo/michael-kenwoodjpg-75320f07ebf1a3d6.jpg", inDanger: false},
  //       { lName: 'Zhang', fName: 'Rui', battery: 100, time1: '00:33', time2: '00.00', image: "https://advancelocal-adapter-image-uploads.s3.amazonaws.com/image.nj.com/home/njo-media/width2048/img/centraljersey_impact/photo/michael-kenwoodjpg-75320f07ebf1a3d6.jpg", inDanger: false},
  //       { lName: 'Lafel', fName: 'Tony', battery: 100, time1: '00:33', time2: '00.00', image: "https://advancelocal-adapter-image-uploads.s3.amazonaws.com/image.nj.com/home/njo-media/width2048/img/centraljersey_impact/photo/michael-kenwoodjpg-75320f07ebf1a3d6.jpg", inDanger: false},
  //       { lName: 'Raynold', fName: 'Luke', battery: 100, time1: '00:33', time2: '00.00', image: "https://advancelocal-adapter-image-uploads.s3.amazonaws.com/image.nj.com/home/njo-media/width2048/img/centraljersey_impact/photo/michael-kenwoodjpg-75320f07ebf1a3d6.jpg", inDanger: false}
  //     ]
  //   }
  // ]

  constructor(private dashboardDataService: DashboardDataService, private _snackBar: MatSnackBar, private peopleService: PeopleService) { }

  ngOnInit(): void {
    if ((window.innerWidth <= 1550 && window.innerWidth >= 1201)) {
      this.breakpoint = 3;
    } else if ((window.innerWidth <= 1200)) {
      this.breakpoint = 2;
    } else {
      this.breakpoint = 4;
    }
    this.getCrews();
    // let all = this.members.reduce((prev, next) => prev.concat(next.crew), []);
    // let result = all.filter(obj => obj.inDanger === true);
    // this.dashboardDataService.publishDashboardObj(result);
    // console.log(result);
  }

  getCrews(){
    forkJoin([
      this.peopleService.getTeam(),
      this.peopleService.getPerson(),
    ]
    ).subscribe(
      (data) => {
        if (data.length > 0) {
          let crewInfo = []
          let Team: any = data[0];
          let People: any = data[1];
          Team.map((item, index) => {
            crewInfo.push({
              teamId: item.TeamID?item.TeamID:'',
              name: item.Name ? item.Name: '',
              crew: this.getCrewMembers(item.TeamID, People),
            })
          });
          this.crews = crewInfo;
        }
      }, error => { console.log('error', error) });
  }
  getCrewMembers(TeamID: any, People: any){
    let crewMemberDetails = []
    let crewMembers: any = People.filter((person) => (person.TeamID === TeamID))
    console.log('crewMembers'+crewMembers)
    crewMembers.forEach(element => {
      var obj: any =[]
      let imageurl = '';
      if(element.ImageUrl)
        if(element.ImageUrl.charAt(0)==='/')
          imageurl = environment.host+element.ImageUrl.substring(1)
        else
          imageurl = environment.host+element.ImageUrl
      obj.FirstName = element.FirstName
      obj.LastName = element.LastName
      obj.ImageUrl = imageurl
      obj.PersonID = element.PersonID
      obj.CheckedIn= element.CheckedIn
      obj.CheckInTime= element.CheckInTime
      obj.CheckOutTime= element.CheckOutTime
      crewMemberDetails.push(obj)
    });
    return crewMemberDetails;

  }
  personChecking(teamId:any, personID:any, event){
    let date:Date = new Date();
    let index = this.crews.findIndex( e=> e.teamId === teamId)
    let person: PeopleData= this.crews[index].crew.find((per) => (per.PersonID === personID))
    person.CheckedIn = event.checked;
    if(event.checked){
      person.CheckInTime = date;
      person.CheckOutTime = null;
    }
    else
      person.CheckOutTime = date; 
    this.peopleService.editPerson(person)
    .subscribe((data)=>{
      
      },
      error => {
        // this.throwErrors(error);
      });
  }
  onResize(event) {
    if ((event.target.innerWidth <= 1550 && event.target.innerWidth >= 1201)) {
      this.breakpoint = 3;
    } else if ((event.target.innerWidth <= 1200)) {
      this.breakpoint = 2;
    } else {
      this.breakpoint = 4;
    }
  }

  getSelectedChip(element)
  {
    this.selectedChip = element;
    // if (element.value === "all") {
    //   this.deviceAssignment.filter ="";
    // }
    // else {
    //   this.deviceAssignment.filter = element.value.trim().toLowerCase();
    // }
  }

  onSelect(member) {
    this.selectedTeam = member;
    this.dashboardDataService.publishDashboardObj(this.selectedTeam);
    window.scroll({ top: 0, left: 0, behavior: 'smooth'});
  }
}
