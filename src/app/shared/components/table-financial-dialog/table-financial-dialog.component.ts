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
    this.row = new DataTable().transform(data.row || data);
    this.list = data.list || [];

    if (!this.row.date) {
      const today = new Date();
      this.row.date = today.toISOString().slice(0, 10);
    }

    this.calculateStartMonth();
    this.calculateMonthProvent();
    this.calculatePurchaseValue();
    this.calculateAccumulated();
  }

  save() {
    this.calculateAccumulated();

    const duplicated = this.list.some(
      (item) =>
        item.sequencial_month === this.row.sequencial_month &&
        item.date !== this.row.date
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

  calculatePurchaseValue(): void {
    const quotas = Number(this.row.purchased_quotas) || 0;
    const quotaValue = Number(this.row.quotas_value) || 0;

    const result = quotas * quotaValue;
    this.row.value_purchased_quotas = Number(result.toFixed(2));

    this.calculateAccumulated();
  }

  calculateMonthProvent(): void {
    const quotas = Number(this.row.quotas_start_month) || 0;
    const dividend = Number(this.row.unit_proven) || 0;

    const result = quotas * dividend;
    this.row.month_value_provent = Number(result.toFixed(2));
  }

  calculateAccumulated(): void {
    const initial = Number(this.row.quotas_start_month) || 0;
    const purchased = Number(this.row.purchased_quotas) || 0;
    const purchasedProvent = Number(this.row.purchased_quotas_proven) || 0;
    const quotaValue = Number(this.row.quotas_value) || 0;

    const totalQuotas = initial + purchased + purchasedProvent;
    const result = totalQuotas * quotaValue;

    this.row.accumulated_value_month = Number(result.toFixed(2));
  }

  calculateStartMonth(): void {
    const currentMonth = Number(this.row.sequencial_month);

    if (!currentMonth || currentMonth <= 1) return;

    const previous = this.list.find(
      (item) => item.sequencial_month === currentMonth - 1
    );

    if (!previous) return;

    const initial = Number(previous.quotas_start_month) || 0;
    const purchased = Number(previous.purchased_quotas) || 0;
    const purchasedProvent = Number(previous.purchased_quotas_proven) || 0;

    const totalPrevious = initial + purchased + purchasedProvent;

    this.row.quotas_start_month = totalPrevious;

    this.calculateMonthProvent();
  }
}
