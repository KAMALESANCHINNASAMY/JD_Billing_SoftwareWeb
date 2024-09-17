import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-selectingstock-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule], // Import CommonModule and FormsModule
  templateUrl: './selectingstock-dialog.component.html',
  styleUrl: './selectingstock-dialog.component.scss'
})
export class SelectingstockDialogComponent {
  getallStockList: any[] = [];
  async ngOnInit() {
    this.getallStockList = this.data.allstock;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SelectingstockDialogComponent>,
    private cdref: ChangeDetectorRef,
  ) { }

  closedialog() {
    const res = { status: false }
    this.dialogRef.close(res);
  }

  save() {
    let array = this.getallStockList.filter((e) => { return e.selected })
    const res = {
      status: true,
      value: array
    }
    this.dialogRef.close(res);
  }


}
