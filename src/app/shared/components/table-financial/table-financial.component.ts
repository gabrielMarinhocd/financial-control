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
    'edit',
  ];

  isAdding = false;
  newRow!: DataTable;

  constructor(private financialService: FinancialService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      if (!this.data.data) {
        this.data.data = [];
      } else {
        // Carregar do localStorage se houver dados salvos
        this.data.data = this.financialService.getData(this.data);
      }
    }
  }

  add() {
    this.isAdding = true;
    this.newRow = new DataTable();
    this.data.data = [this.newRow, ...this.data.data!];
  }

  save() {
    this.isAdding = false;

    if (this.newRow) {
      // Salvar no localStorage via serviço
      this.financialService.addEntry(this.data, this.newRow);
    }
  }

  cancel() {
    this.data.data = this.data.data?.filter((r) => r !== this.newRow);
    this.isAdding = false;
  }

  isEditing(row: DataTable): boolean {
    return this.isAdding && row === this.newRow;
  }
}
