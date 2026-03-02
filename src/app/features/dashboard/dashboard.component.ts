import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableFinancialComponent } from '../../shared/components/table-financial/table-financial.component';
import { DataTable } from '../../models/data-table.model';
import { MaterialModule } from '../../shared/material/material.module';
import { Table } from '../../models/table.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TableFinancialComponent, MaterialModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  tables: Table[] = [];
  selectedTable?: Table;

  ngOnInit(): void {
    const storedTables = localStorage.getItem('financial_tables');

    if (storedTables) {
      const parsed = JSON.parse(storedTables);
      this.tables = parsed.map((t: any) => new Table().transform(t));
    } else {
      const defaultTable = this.createDefaultTable();

      this.tables = [defaultTable];

      localStorage.setItem('financial_tables', JSON.stringify(this.tables));
    }

    this.selectedTable = this.tables[0];
  }

  selectTable(table: Table) {
    this.selectedTable = table;
  }

  createDefaultTable(): Table {
    return new Table(
      1,
      'MXRF11',
      'Teste Inicial',
      undefined,
      [
        new DataTable(
          1,
          '2026-02-01',
          1,
          '208',
          9.4,
          0.1,
          18,
          169.2,
          20.8,
          2,
          18.8,
          1955.2,
          1
        ),
      ],
      1
    );
  }

  addTable() {
    alert('Cadastrar nova tabela');
  }
}
