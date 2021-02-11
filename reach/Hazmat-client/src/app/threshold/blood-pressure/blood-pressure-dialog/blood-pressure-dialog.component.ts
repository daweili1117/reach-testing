import { Component, OnInit, Output, EventEmitter, Inject, Optional } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { RestheaderService } from 'src/app/restheader.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '../../../shared/notification.service';
import { invalid } from '@angular/compiler/src/render3/view/util';
import {BloodPressureData} from '../blood-pressure.model';
import {BloodPressureService} from '../blood-pressure.service';
import { ReactiveFormConfig, RxwebValidators } from '@rxweb/reactive-form-validators';

//cross-field validation for Blood Pressure
const numberValidator: ValidatorFn = (control: FormGroup) : ValidationErrors | null => {
  const lowMapControl = control.get('LowMAP');
  const normalLowMapControl = control.get('NormalLowMAP');
  const normalHighMapControl = control.get('NormalHighMAP');
  const highMapControl = control.get('HighMAP');

  const lowMap = Number(lowMapControl.value);
  const normalLowMap = Number(normalLowMapControl.value);
  const normalHighMap = Number(normalHighMapControl.value);
  const highMap = Number(highMapControl.value);
  if(!lowMapControl || !normalLowMapControl || !normalHighMapControl || !highMapControl){
    return null;
  }
  if( !lowMap || !normalLowMap || !normalHighMap || !highMap){
    return null;
  }
  
  if (lowMap > normalLowMap || lowMap > normalHighMap || lowMap > highMap
    || normalLowMap > normalHighMap || normalLowMap > highMap || normalHighMap > highMap){
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
  selector: 'app-blood-pressure-dialog',
  templateUrl: './blood-pressure-dialog.component.html',
  styleUrls: ['./blood-pressure-dialog.component.scss']
})
export class BloodPressureDialogComponent implements OnInit {
  
  editBloodPressure: BloodPressureData;
  action: string;
  
  constructor(private bloodPressureService: BloodPressureService,
    private httpClient: HttpClient,
    private restHeaderService: RestheaderService,
    public dialogRef: MatDialogRef<BloodPressureDialogComponent>,
    private notificationService: NotificationService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: BloodPressureData) { 
      this.editBloodPressure = {...data}
      if(this.editBloodPressure.BloodPressureID == null){
        this.action = 'New';
      }
      else{
        this.action = 'Edit';
      }
  }

  errormessages: any =[];
  bloodPressureFormGroup: FormGroup;

  ngOnInit(): void {
    ReactiveFormConfig.set({"validationMessage":{"greaterThan":"Input should be greater than field above."}});

    if (this.action == 'Edit'){
      this.bloodPressureFormGroup = new FormGroup({
        BloodPressureID: new FormControl(this.editBloodPressure.BloodPressureID),
        LowMAP: new FormControl(this.editBloodPressure.LowMAP, [Validators.required, Validators.min(1)]),
        NormalLowMAP: new FormControl(this.editBloodPressure.NormalLowMAP, [Validators.required, Validators.min(1), RxwebValidators.greaterThan({fieldName:'LowMAP'})]),
        NormalHighMAP: new FormControl(this.editBloodPressure.NormalHighMAP, [Validators.required, Validators.min(1), RxwebValidators.greaterThan({fieldName:'NormalLowMAP'})]),     
        HighMAP: new FormControl(this.editBloodPressure.HighMAP, [Validators.required, Validators.min(1), RxwebValidators.greaterThan({fieldName:'NormalHighMAP'})]),
        BPIndex: new FormControl(this.editBloodPressure.BPIndex, [Validators.required]),
      }
      ,{validators: numberValidator}
      );      
    }
    else {
      this.bloodPressureFormGroup = new FormGroup({
        BloodPressureID: new FormControl(null),
        LowMAP: new FormControl('', [Validators.required, Validators.min(1)]),
        NormalLowMAP: new FormControl('', [Validators.required, Validators.min(1), RxwebValidators.greaterThan({fieldName:'LowMAP'})]),
        NormalHighMAP: new FormControl('', [Validators.required, Validators.min(1), RxwebValidators.greaterThan({fieldName:'NormalLowMAP'})]),
        HighMAP: new FormControl('', [Validators.required, Validators.min(1), RxwebValidators.greaterThan({fieldName:'NormalHighMAP'})]),
        BPIndex: new FormControl('', [Validators.required]),     
      }
      ,{validators: numberValidator}
      );
    }
  }

  saveBloodPressure(bloodPressure: BloodPressureData){
    if (this.action == 'Edit'){
      console.log()
      this.bloodPressureService.editBloodPressure(bloodPressure)
      .subscribe((data)=>{
        // console.log(data)
        this.notificationService.success(' Blood Pressure MAP updated successfully');
        this.dialogRef.close({event:this.action,data:data});        
      },
      error => {
        this.throwErrors(error);
      })
    }
    else{
      this.bloodPressureService.addBloodPressure(bloodPressure)
      .subscribe((data) => {
        this.notificationService.success(' Blood Pressure MAP added successfully');
        this.dialogRef.close({event:this.action,data:data});
      }, 
      error => {
        this.throwErrors(error);
      });
  }
  }

  throwErrors(error: any){
    this.errormessages = [];
    let errors= [];
    const frmGroup = this.bloodPressureFormGroup;
    Object.keys(error).map(function(key){
      if(key=='error'){
        let err:object = error[key];
        Object.keys(err).map(function(key){
          const formControl = frmGroup.get(key);
          if (formControl){
            let msg = '';
            if(key=='BPIndex'){
              err[key].forEach(element => {
                if(element.includes('already'))
                  msg = 'BP Index already exists. Please enter a unique BP Index'
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

  cancelBloodPressure() {
    this.notificationService.warn('Operation Cancelled');
    this.dialogRef.close({event:''});
  }

}
