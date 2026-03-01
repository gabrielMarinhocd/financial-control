import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { DataTable } from '../../../models/data-table.model';
import { Table } from '../../../models/table.model';
import { MaterialModule } from '../../material/material.module';
import { FinancialService } from '../../../core/services/financial.service';
import { MatDialog } from '@angular/material/dialog';
import { TableFinancialDialogComponent } from '../table-financial-dialog/table-financial-dialog.component';

@Component({
  selector: 'app-table-financial',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, MatTableModule],
  templateUrl: './table-financial.component.html',
  styleUrls: ['./table-financial.component.scss'],
})
export class TableFinancialComponent implements OnChanges, AfterViewInit {
  @Input() data: Table = new Table();
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<DataTable>();

  displayedColumns: string[] = [
    'actions',
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

  isAdding = false;
  isUpdate = false;
  newRow!: DataTable;
  isMobile: boolean = false;

  constructor(
    private financialService: FinancialService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.onCheckMobile();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      if (!this.data.data) {
        this.data.data = [];
      } else {
        this.data = this.financialService.getData(this.data.name!) || this.data;
      }

      this.dataSource.data = this.data.data!;
    }
  }

  onCheckMobile(event?: any) {
    const width = event?.target?.innerWidth || window.innerWidth;

    this.isMobile = width <= 768;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (
      item: DataTable,
      property: string
    ) => {
      if (property === 'date') {
        return item.date ? new Date(item.date).getTime() : 0;
      }
      return (item as any)[property];
    };
  }

  add(): void {
    const dialogRef = this.dialog.open(TableFinancialDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: new DataTable(),
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.data.data!.push(result);

        this.financialService.saveData(this.data.name!, this.data);

        this.dataSource.data = this.data.data!;
      }
    });
  }

  edit(row: DataTable): void {
    const dialogRef = this.dialog.open(TableFinancialDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: row,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.data.data!.findIndex((r) => r === row);

        if (index !== -1) {
          this.data.data![index] = result;
        }

        this.financialService.saveData(this.data.name!, this.data);

        this.dataSource.data = this.data.data!;
      }
    });
  }

  save(row?: DataTable): void {
    this.isAdding = false;
    const target = row || this.newRow;
    if (target) {
      this.financialService.saveData(this.data.name!, this.data);
    }
    this.dataSource.data = this.data.data!;
  }

  cancel(row?: DataTable): void {
    this.isAdding = false;
  }

  isEditing(row: DataTable): boolean {
    return this.isAdding && row === this.newRow;
  }

  delete(row: DataTable): void {
    this.data.data = this.data.data?.filter((r) => r !== row);
    this.save(this.data);
    this.dataSource.data = this.data.data!;
  }
}
