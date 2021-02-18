import { Component, OnInit, Output, EventEmitter, Inject, Optional } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { RestheaderService } from 'src/app/restheader.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators, ValidationErrors, ValidatorFn } from '@angular/forms';
import { HearrateDetails } from '../heart-rate.model';
import { HeartRateService } from '../heart-rate.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '../../../shared/notification.service';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { ReactiveFormConfig, RxwebValidators } from '@rxweb/reactive-form-validators';

//cross-field validation for Heart Rates
const numberValidator: ValidatorFn = (control: FormGroup) : ValidationErrors | null => {
  const lowCriticalControl = control.get('LowCritical');
  const lowTargetControl = control.get('LowTargetHR');
  const highTargetControl = control.get('HighTargetHR');
  const highCriticalControl = control.get('HighCritical');

  const lowCritical = Number(lowCriticalControl.value);
  const lowTarget = Number(lowTargetControl.value);
  const highTarget = Number(highTargetControl.value);
  const highCritical = Number(highCriticalControl.value);
  if(!lowCriticalControl || !lowTargetControl || !highTargetControl || !highCriticalControl){
    return null;
  }
  if( !lowCritical || !lowTarget || !highTarget || !highCritical){
    return null;
  }
  if (lowCritical > lowTarget || lowCritical > highTarget || lowCritical > highCritical
    || lowTarget > highTarget || lowTarget > highCritical || highTarget > highCritical
    ){
    return { numberOutOfRange: true };
  }
  else {
    return null;
  }
};

export interface Select {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-heart-rate-add',
  templateUrl: './heart-rate-add.component.html',
  styleUrls: ['./heart-rate-add.component.scss']
})
export class HeartRateAddComponent implements OnInit {
  editHeartRate: HearrateDetails;
  action: string;

  constructor(private heartRateService: HeartRateService,
              private httpClient: HttpClient,
              private restHeaderService: RestheaderService,
              public dialogRef: MatDialogRef<HeartRateAddComponent>,
              private notificationService: NotificationService,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: HearrateDetails) { 
    this.editHeartRate = {...data}
    if(this.editHeartRate.HeartRateID == null){
      this.action = 'New';
    }
    else{
      this.action = 'Edit';
    }
            
  }

  errormessages: any =[];
  heartRateFormGroup: FormGroup;

  ngOnInit(): void {
    ReactiveFormConfig.set({"validationMessage":{"greaterThan":"Input should be greater than field above."}});

    if(this.action =='Edit'){
      this.heartRateFormGroup = new FormGroup({
        HeartRateID: new FormControl(this.editHeartRate.HeartRateID), 
        AgeGroup: new FormControl(this.editHeartRate.AgeGroup, [Validators.required]),
        LowCritical: new FormControl(this.editHeartRate.LowCritical, [Validators.required, Validators.min(1)]),
        LowTargetHR: new FormControl(this.editHeartRate.LowTargetHR, [Validators.required, Validators.min(1), RxwebValidators.greaterThan({fieldName:'LowCritical'})]),
        HighTargetHR: new FormControl(this.editHeartRate.HighTargetHR, [Validators.required, Validators.min(1), RxwebValidators.greaterThan({fieldName:'LowTargetHR'})]),
        HighCritical: new FormControl(this.editHeartRate.HighCritical, [Validators.required, Validators.min(1), RxwebValidators.greaterThan({fieldName:'HighTargetHR'})]),
        HRIndex: new FormControl(this.editHeartRate.HRIndex, [Validators.required]),
      }
      ,{validators: numberValidator}
      );
      
    }
    else{
      this.heartRateFormGroup = new FormGroup({
        HeartRateID: new FormControl(null),
        AgeGroup: new FormControl('', [Validators.required]),
        LowCritical: new FormControl('', [Validators.required, Validators.min(1)]),
        LowTargetHR: new FormControl('', [Validators.required, Validators.min(1), RxwebValidators.greaterThan({fieldName:'LowCritical'})]),
        HighTargetHR: new FormControl('', [Validators.required, Validators.min(1), RxwebValidators.greaterThan({fieldName:'LowTargetHR'})]),
        HighCritical: new FormControl('', [Validators.required, Validators.min(1), RxwebValidators.greaterThan({fieldName:'HighTargetHR'})]),
        HRIndex: new FormControl('', [Validators.required]),      
      }
      ,{validators: numberValidator}
      );
    }

  }

  saveHeartRate(heartRate: HearrateDetails){
    if (this.action == 'Edit'){
      console.log()
      this.heartRateService.editHeartRate(heartRate)
      .subscribe((data)=>{
        // console.log(data)
        this.notificationService.success(' Heart Rate updated successfully');
        this.dialogRef.close({event:this.action,data:data});        
      },
      error => {
        this.throwErrors(error);
      })
    }
    else {
      this.heartRateService.addHeartRate(heartRate)
      .subscribe((data)=>{
        this.notificationService.success(' Heart Rate added successfully');
        this.dialogRef.close({event:this.action,data:data});
      },
      error => {
        // console.log(error);
        this.throwErrors(error);
      });  
    }
  }

  checkLowCritical(group: FormGroup){
    if (group.controls.LowCritical.value > group.controls.LowTargetHR){
        return {lowCriticalGreaterThanLowTarget: true}
    }
    return null;
  }

  throwErrors(error: any){
    this.errormessages = [];
    let errors= [];
    const frmGroup = this.heartRateFormGroup;
    Object.keys(error).map(function(key){
      if(key=='error'){
        let err:object = error[key];
        Object.keys(err).map(function(key){
          const formControl = frmGroup.get(key);
          if (formControl){
            let msg = '';
            if(key=='HRIndex'){
              err[key].forEach(element => {
                if(element.includes('already'))
                  msg = 'HR Index already exists. Please enter a unique HR Index'
                });
            }
            if(!msg){
              err[key].forEach(element => {
                msg = element;
              });
            }
            formControl.setErrors({
              serverError: msg
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

    this.errormessages = this.errormessages.concat(errors);

  }

  cancelHeartRate() {
    this.notificationService.warn('Operation Cancelled');
    this.dialogRef.close({event:''});
  }

}
