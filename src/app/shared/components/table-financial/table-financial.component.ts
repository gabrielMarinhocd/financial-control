import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DataTable } from '../../../models/data-table.model';
import { Table } from '../../../models/table.model';
import { MaterialModule } from '../../material/material.module';
import { FinancialService } from '../../../core/services/financial.service';

@Component({
  selector: 'app-table-financial',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule],
  templateUrl: './table-financial.component.html',
  styleUrls: ['./table-financial.component.scss'],
})
export class TableFinancialComponent implements OnChanges {
  @Input() data: Table = new Table();

  displayedColumns: string[] = [
    'date',
    'sequencial_month',
    'quotas_start_month',
    'quotas_value',
    'unit_proven',
    'purchased_quotas',
    'value_purchased_quotas',
    'month_value_provent',
    'purchased_quotas_proven',
    'value_purchased_quotas_proven',
    'accumulated_value_month',
  ];

  tableColumns: string[] = [];

  isAdding = false;
  isUpdate = false;
  newRow!: DataTable;

  constructor(private financialService: FinancialService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      if (!this.data.data) {
        this.data.data = [];
      } else {
        this.data = this.financialService.getData(this.data.name!);
      }
    }

    this.tableColumns = ['actions', ...this.displayedColumns];
  }

  changeAction() {
    if (this.isUpdate) {
      const itemIndex = this.data.data!.findIndex((a) => a.id === this.newRow.id);  

      if (itemIndex !== -1) {

        this.data.data![itemIndex] = this.newRow;
      } else {
        this.data.data!.push(this.newRow);
      }
    } else {
      this.isAdding = true;
      this.newRow = new DataTable();
      this.data.data = [this.newRow, ...this.data.data!]; 
    }
  }

  save(row?: DataTable) {
    this.isAdding = false;
    const target = row || this.newRow;
    if (target) {
      this.financialService.saveData(this.data.name!, this.data);
    }
  }

  cancel(row?: DataTable) {
    const target = row || this.newRow;
    this.data.data = this.data.data?.filter((r) => r !== target);
    this.isAdding = false;
  }

  isEditing(row: DataTable): boolean {
    return this.isAdding && row === this.newRow;
  }

  edit(row: DataTable) {
    this.isAdding = true;
    this.isUpdate = true;
    this.newRow = row;
  }

  delete(row: DataTable) {
    this.data.data = this.data.data?.filter((r) => r !== row);
    this.save(this.data);
  }
}