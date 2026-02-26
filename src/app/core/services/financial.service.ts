import { Injectable } from '@angular/core';
import { Table } from '../../models/table.model';
import { DataTable } from '../../models/data-table.model';

@Injectable({
  providedIn: 'root'
})
export class FinancialService {

  private getKey(table: Table): string {
    // Se não houver name definido, usa 'default'
    return `financial_${table.name ?? 'default'}`;
  }

  getData(table: Table): DataTable[] {
    const data = localStorage.getItem(this.getKey(table));
    return data ? JSON.parse(data) : [];
  }

  saveData(table: Table, entries: DataTable[]): void {
    localStorage.setItem(this.getKey(table), JSON.stringify(entries));
  }

  addEntry(table: Table, entry: DataTable): void {
    const data = this.getData(table);
    data.push(entry);
    this.saveData(table, data);
  }
}