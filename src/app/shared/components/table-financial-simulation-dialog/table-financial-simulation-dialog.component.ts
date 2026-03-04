import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-table-financial-simulation-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './table-financial-simulation-dialog.component.html',
})
export class TableFinancialSimulationDialogComponent {
  months: number = 12;
  quotasPerMonth: number = 0;
  increment: number = 0;
  useCurrentPrice: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<TableFinancialSimulationDialogComponent>
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }

  simulate(): void {
    this.dialogRef.close({
      months: this.months,
      quotasPerMonth: this.quotasPerMonth,
      increment: this.increment,
      useCurrentPrice: this.useCurrentPrice,
    });
  }
}
