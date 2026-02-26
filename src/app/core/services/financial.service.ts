import { Injectable } from '@angular/core';
import { DataTable } from '../../models/data-table.model';
import { Table } from '../../models/table.model';

@Injectable({
  providedIn: 'root',
})
export class FinancialService {
  private getKey(ticker: string): string {
    return `financial_${ticker}`;
  }

  createTable(): any {
    localStorage.setItem('financial_MXRF11', JSON.stringify(new Table()));

    return true;
  }

  getData(name_table: string): Table {
    const data = localStorage.getItem(this.getKey(name_table));
    return data ? JSON.parse(data) : new Table();
  }

  saveData(name_table: string, entries: Table): void {
    localStorage.setItem(this.getKey(name_table), JSON.stringify(entries));
  }
}
