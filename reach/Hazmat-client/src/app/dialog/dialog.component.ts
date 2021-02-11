import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onOk(): void {
    this.dialogRef.close({event:'Remove'});
  }
  onCancel():void{
    this.dialogRef.close({event:'Cancel'});
  }

}


export interface DialogData {
  name: string;
  message: string;
}

 
