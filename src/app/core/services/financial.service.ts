import { Injectable } from '@angular/core';
import { Table } from '../../models/table.model';
import { environment } from '../../../env/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class FinancialService {
  async getQuote(ticker: string): Promise<number | null> {
    try {
      const response = await fetch(
        `https://brapi.dev/api/quote/${ticker}?token=${environment.brapiToken}`,
      );

      const data = await response.json();

      return data?.results?.[0] || null;
      return null;
    } catch (error) {
      console.error('Erro ao consultar cotação', error);
      return null;
    }
  }

  createTable(tables: any): any {
    localStorage.setItem('financial_tables', JSON.stringify(tables));
    return true;
  }

  updateTable(tables: any): any {
    localStorage.setItem('financial_tables', JSON.stringify(tables));
    return tables;
  }

  getData(name_table: string): Table {
    const data = localStorage.getItem(name_table);
    return data ? JSON.parse(data) : new Table();
  }

  saveData(name_table: string, entries: Table): void {
    localStorage.setItem(name_table, JSON.stringify(entries));
  }

  getTables(): any {
    return localStorage.getItem('financial_tables');
  }

  deleteTable(id: number): Table[] {
    const stored = localStorage.getItem('financial_tables');
    if (!stored) return [];

    const data: Table[] = JSON.parse(stored);

    const filtered = data.filter((t) => t.id !== id);

    localStorage.setItem('financial_tables', JSON.stringify(filtered));
    sessionStorage.setItem('tables', JSON.stringify(filtered));

    return filtered;
  }
}
