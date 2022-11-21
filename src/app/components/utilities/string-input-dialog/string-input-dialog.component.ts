import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InputStringDialog } from 'src/app/models/InputStringDialog';

@Component({
  selector: 'app-string-input-dialog',
  templateUrl: './string-input-dialog.component.html',
  styleUrls: ['./string-input-dialog.component.scss']
})
export class StringInputDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<StringInputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InputStringDialog,
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.data.string = "";
    this.dialogRef.close();
  }
}
