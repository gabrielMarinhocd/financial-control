import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-table-financial-simulation-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './table-financial-simulation-dialog.component.html',
})
export class TableFinancialSimulationDialogComponent implements OnInit {
  months: number = 12;
  quotasPerMonth: number = 0;
  increment: number = 0;
  useCurrentPrice: boolean = true;
  unitProvent: number = 0;

  constructor(
    private dialogRef: MatDialogRef<TableFinancialSimulationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) {}

  ngOnInit(): void {
    if (this.data?.list?.length) {
  
      const last = this.data.list.reduce((prev: any, curr: any) =>
        (curr.sequencial_month || 0) > (prev.sequencial_month || 0)
          ? curr
          : prev
      );

      this.unitProvent = last.unit_proven || 0;
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  simulate(): void {
    this.dialogRef.close({
      months: this.months,
      quotasPerMonth: this.quotasPerMonth,
      increment: this.increment,
      useCurrentPrice: this.useCurrentPrice,
      unitProvent: this.unitProvent,
    });
  }
}