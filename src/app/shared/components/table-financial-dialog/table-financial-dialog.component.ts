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
  templateUrl: './table-financial-dialog.component.html',
  styleUrls: ['./table-financial-dialog.component.scss'],
})
export class TableFinancialDialogComponent {
  row: DataTable = new DataTable();
  list: DataTable[] = [];

  constructor(
    public dialogRef: MatDialogRef<TableFinancialDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    Object.assign(this.row, data.row);
    this.list = data.list || [];
  }

  save() {
    const duplicated = this.list.some(
      (item) =>
        item.sequencial_month === this.row.sequencial_month &&
        item !== this.data.row
    );

    if (duplicated) {
      alert('Já existe um registro com este mês sequencial.');
      return;
    }

    this.dialogRef.close(this.row);
  }

  close() {
    this.dialogRef.close();
  }
}