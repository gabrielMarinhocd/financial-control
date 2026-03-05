import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
  OnInit,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DataTable } from '../../../models/data-table.model';
import { Table } from '../../../models/table.model';
import { MaterialModule } from '../../material/material.module';
import { FinancialService } from '../../../core/services/financial.service';
import { MatDialog } from '@angular/material/dialog';
import { TableFinancialDialogComponent } from '../table-financial-dialog/table-financial-dialog.component';
import { TableFinancialSimulationDialogComponent } from '../table-financial-simulation-dialog/table-financial-simulation-dialog.component';

@Component({
  selector: 'app-table-financial',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    MatTableModule,
    TableFinancialSimulationDialogComponent,
  ],
  templateUrl: './table-financial.component.html',
  styleUrls: ['./table-financial.component.scss'],
})
export class TableFinancialComponent
  implements OnChanges, AfterViewInit, OnInit
{
  @Input() data: Table = new Table();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<DataTable>();

  quote = {
    price: 0,
    dividend: 0,
  };

  displayedColumns: string[] = [
    'actions',
    'date',
    'sequencial_month',
    'quotas_start_month',
    'quotas_value',
    'purchased_quotas',
    'value_purchased_quotas',
    'unit_proven',
    'month_value_provent',
    'purchased_quotas_proven',
    'value_purchased_quotas_proven',
    'accumulated_value_month',
    'total_quotas',
  ];

  isAdding = false;
  newRow!: DataTable;

  isMobile: boolean = false;

  simulationActive: boolean = false;

  constructor(
    private financialService: FinancialService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.checkMobile();

    if (this.data?.data) {
      this.dataSource.data = [...this.data.data];
    }

    if (this.data?.name) {
      this.loadQuote();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.dataSource.data = this.data.data ?? [];

      if (this.data?.name) {
        this.loadQuote();
      }
    }
  }

  ngAfterViewInit(): void {
    this.applyTableFeatures();
  }

  applyTableFeatures(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.dataSource.sortingDataAccessor = (
      item: DataTable,
      property: string,
    ) => {
      if (property === 'date') {
        return item.date ? new Date(item.date).getTime() : 0;
      }

      return (item as any)[property];
    };
  }

  @HostListener('window:resize')
  checkMobile(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  loadQuote(): void {
    if (!this.data?.name) return;

    this.financialService.getQuote(this.data.name).then((result: any) => {
      this.quote = {
        price: result?.regularMarketPrice || 0,
        dividend: result?.regularMarketChange || 0,
      };
    });
  }

  private updateTables(): void {
    const tables = JSON.parse(sessionStorage.getItem('tables') || '[]');

    const index = tables.findIndex((t: any) => t.name === this.data.name);

    if (index !== -1) {
      tables[index] = this.data;
    }

    sessionStorage.setItem('tables', JSON.stringify(tables));

    this.financialService.updateTable(tables);
  }

  add(): void {
    const dialogRef = this.dialog.open(TableFinancialDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: {
        row: new DataTable(),
        list: this.data.data,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this.data.data = this.data.data || [];
      this.data.data.push(result);

      this.updateTables();

      this.dataSource.data = [...this.data.data];

      this.applyTableFeatures();
    });
  }

  edit(row: DataTable): void {
    const dialogRef = this.dialog.open(TableFinancialDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: {
        row: { ...row },
        list: this.data.data,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      const index = this.data.data!.findIndex((r) => r.id === row.id);

      if (index !== -1) {
        this.data.data![index] = result;
      }

      this.updateTables();

      this.dataSource.data = [...this.data.data!];
    });
  }

  delete(row: DataTable): void {
    this.data.data = this.data.data?.filter((r) => r.id !== row.id);

    this.updateTables();

    this.dataSource.data = [...this.data.data!];
  }

  getAccumulatedTooltip(row: any): string {
    const start = row.quotas_start_month || 0;
    const purchased = row.purchased_quotas || 0;
    const proven = row.purchased_quotas_proven || 0;
    const price = row.quotas_value || 0;

    const totalQuotas = start + purchased + proven;

    const total = totalQuotas * price;

    return `(${start} + ${purchased} + ${proven}) × ${price.toFixed(
      2,
    )} = ${total.toFixed(2)}`;
  }

  simulate(): void {
    const dialogRef = this.dialog.open(
      TableFinancialSimulationDialogComponent,
      {
        width: '400px',
      },
    );

    dialogRef.afterClosed().subscribe((config) => {
      if (!config) return;

      const simulated = this.simulateData(config);

      this.simulationActive = true;

      this.dataSource.data = [...(this.data.data || []), ...simulated];
    });
  }

  simulateData(config: any): DataTable[] {
    const result: DataTable[] = [];

    if (!this.data.data?.length) return result;

    const last = this.data.data[this.data.data.length - 1];

    let quotas =
      (last.quotas_start_month || 0) +
      (last.purchased_quotas || 0) +
      (last.purchased_quotas_proven || 0);

    const dividend = last.unit_proven || 0;

    const price = config.useCurrentPrice
      ? this.quote.price || 1
      : last.quotas_value || 1;

    for (let i = 1; i <= config.months; i++) {
      const quotasPurchased =
        (config.quotasPerMonth || 0) + (config.increment || 0) * (i - 1);

      const quotasStartMonth = quotas;

      quotas += quotasPurchased;

      const monthDividend = quotas * dividend;

      const quotasFromDividend = Math.floor(monthDividend / price);

      const accumulatedValue = (quotas + quotasFromDividend) * price;

      const row = new DataTable(
        Date.now() + i,
        '',
        (last.sequencial_month || 0) + i,
        quotasStartMonth,
        price,
        dividend,
        quotasPurchased,
        quotasPurchased * price,
        monthDividend,
        quotasFromDividend,
        quotasFromDividend * price,
        accumulatedValue,
        1,
      );

      result.push(row);

      quotas += quotasFromDividend;
    }

    return result;
  }

  clearSimulation(): void {
    this.dataSource.data = [...(this.data.data || [])];
    this.simulationActive = false;
  }

  get totalQuotas(): number {
    if (!this.dataSource.data?.length) return 0;

    const last = this.dataSource.data[this.dataSource.data.length - 1];

    return (
      (last.quotas_start_month || 0) +
      (last.purchased_quotas || 0) +
      (last.purchased_quotas_proven || 0)
    );
  }

  get totalValue(): number {
    if (!this.dataSource.data?.length) return 0;

    const last = this.dataSource.data[this.dataSource.data.length - 1];

    return last.accumulated_value_month || 0;
  }

  get averagePrice(): number {
    if (!this.dataSource.data?.length) return 0;

    let totalInvested = 0;
    let totalQuotasPurchased = 0;

    this.dataSource.data.forEach((row, index) => {
      const price = row.quotas_value || 0;

      const purchased = row.purchased_quotas || 0;
      const purchasedValue = row.value_purchased_quotas || 0;

      const dividendQuotas = row.purchased_quotas_proven || 0;
      const dividendValue = row.value_purchased_quotas_proven || 0;

      let rowInvested = purchasedValue + dividendValue;
      let rowQuotas = purchased + dividendQuotas;

      if (index === 0) {
        const initialQuotas = row.quotas_start_month || 0;
        rowInvested += initialQuotas * price;
        rowQuotas += initialQuotas;
      }

      totalInvested += rowInvested;
      totalQuotasPurchased += rowQuotas;
    });

    if (!totalQuotasPurchased) return 0;

    return totalInvested / totalQuotasPurchased;
  }
  
  get maxSequencialMonth(): number {
    if (!this.dataSource.data?.length) return 0;

    return Math.max(
      ...this.dataSource.data.map((r) => r.sequencial_month || 0),
    );
  }

  getTotalQuotasRow(row: DataTable): number {
    return (
      (row.quotas_start_month || 0) +
      (row.purchased_quotas || 0) +
      (row.purchased_quotas_proven || 0)
    );
  }

  getTotalQuotasTooltip(row: DataTable): string {
    const start = row.quotas_start_month || 0;
    const purchased = row.purchased_quotas || 0;
    const prov = row.purchased_quotas_proven || 0;

    return `${start} + ${purchased} + ${prov} = ${start + purchased + prov}`;
  }
}
