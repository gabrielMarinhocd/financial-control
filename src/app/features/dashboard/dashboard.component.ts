import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableFinancialComponent } from '../../shared/components/table-financial/table-financial.component';
import { DataTable } from '../../models/data-table.model';
import { MaterialModule } from '../../shared/material/material.module';
import { Table } from '../../models/table.model';
import { FinancialService } from '../../core/services/financial.service';
import { MatDialog } from '@angular/material/dialog';
import { TableCreateDialogComponent } from '../../shared/components/table-create-dialog/table-create-dialog.component';

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

  constructor(
    private financialService: FinancialService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const storedTables = localStorage.getItem('financial_tables');

    if (storedTables) {
      const parsed = JSON.parse(storedTables);

      this.tables = parsed.map((t: any) => new Table().transform(t));

      sessionStorage.setItem('tables', JSON.stringify(this.tables));
    } else {
      const defaultTable = this.createDefaultTable();

      this.tables = [defaultTable];

      this.financialService.createTable(this.tables);

      sessionStorage.setItem('tables', JSON.stringify(this.tables));
    }

    if (this.tables.length > 0) {
      this.selectedTable = this.tables[0];
    }
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
          208,
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
    const dialogRef = this.dialog.open(TableCreateDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      const newTable = new Table(
        Date.now(),
        result.name.toUpperCase(),
        result.description,
        undefined,
        [],
        1
      );

      this.tables.push(newTable);

      this.selectedTable = newTable;

      sessionStorage.setItem('tables', JSON.stringify(this.tables));

      this.financialService.updateTable(this.tables);
    });
  }
}
