import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableFinancialComponent } from '../../shared/components/table-financial/table-financial.component';
import { DataTable } from '../../models/data-table.model';
import { MaterialModule } from '../../shared/material/material.module';
import { Table } from '../../models/table.model';
import { FinancialService } from '../../core/services/financial.service';
import { MatDialog } from '@angular/material/dialog';
import { TableCreateDialogComponent } from '../../shared/components/table-create-dialog/table-create-dialog.component';
import { ConfigDialogComponent } from '../../shared/components/config-dialog/config-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TableEditDialogComponent } from '../../shared/components/table-edit-name-dialog/table-edit-name-dialog.component';

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
  isMobile = false;
  constructor(
    private financialService: FinancialService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.checkScreen();
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

  @HostListener('window:resize') onResize() {
    this.checkScreen();
  }

  checkScreen() {
    this.isMobile = window.innerWidth <= 768;
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
          2143.20,
          1,
        ),
      ],
      1,
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
        1,
      );
      this.tables.push(newTable);
      this.selectedTable = newTable;
      sessionStorage.setItem('tables', JSON.stringify(this.tables));
      this.financialService.updateTable(this.tables);
    });
  }

  openConfig() {
    this.dialog.open(ConfigDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
    });
  }

  removeTable(table: Table) {
    const stored = localStorage.getItem('financial_tables');

    if (!stored) return;

    const data: Table[] = JSON.parse(stored);
    const index = data.findIndex((t) => t.id === table.id);

    if (index === -1) return;
    data.splice(index, 1);

    localStorage.setItem('financial_tables', JSON.stringify(data));
    sessionStorage.setItem('tables', JSON.stringify(data));

    this.tables = data;
    this.selectedTable = this.tables.length ? this.tables[0] : undefined;

    this.financialService.updateTable(this.tables);
  }

  openDeleteDialog(table: Table) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { name: table.name },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        if (table.id == null) {
          console.error('Tabela sem ID', table);
          this.snackBar.open('Erro!', 'ok', {
            duration: 3000,
            panelClass: ['snackbar-error'],
          });

          return;
        }

        this.tables = this.financialService.deleteTable(table.id);
        this.selectedTable = this.tables.length ? this.tables[0] : undefined;

        this.snackBar.open('Removido com sucesso!', 'OK', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
      }
    });
  }

  openEditDialog(table: Table) {
    const dialogRef = this.dialog.open(TableEditDialogComponent, {
      width: '400px',
      data: { ...table }, 
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      const index = this.tables.findIndex((t) => t.id === table.id);
      if (index === -1) return;

      this.tables[index].name = result.name;
      this.tables[index].describe = result.description;

      this.financialService.updateTable(this.tables);

      this.snackBar.open('Tabela atualizada!', 'OK', {
        duration: 3000,
        panelClass: ['snackbar-success'],
      });
    });
  }
}
