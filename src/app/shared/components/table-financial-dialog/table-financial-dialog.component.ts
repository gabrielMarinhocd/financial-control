import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MaterialModule } from '../../material/material.module';
import { DataTable } from '../../../models/data-table.model';

@Component({
  selector: 'app-table-financial-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, MatDialogModule],
  templateUrl: './table-financial-dialog.component.html',   // 👈 faltava isso
  styleUrls: ['./table-financial-dialog.component.scss'],
})
export class TableFinancialDialogComponent {

  row: DataTable = new DataTable();

  constructor(
    public dialogRef: MatDialogRef<TableFinancialDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataTable
  ) {
    Object.assign(this.row, data);
  }

  save() {
    this.dialogRef.close(this.row);
  }

  close() {
    this.dialogRef.close();
  }
}