import { Injectable } from '@angular/core';
import { Table } from '../../models/table.model';

@Injectable({
  providedIn: 'root',
})
export class FinancialService {
  async getQuote(ticker: string): Promise<any | null> {
    try {
      const response = await fetch(
        `https://api-financial-control-9skh.onrender.com/quote?ticker=${ticker}`,
      );

      const data = await response.json();

      return data || null;
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

  async getDividends(ticker: string): Promise<any[]> {
    try {
      const url = `https://api-financial-control-9skh.onrender.com/dividends?ticker=${ticker}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!Array.isArray(data)) return [];

      const dividends = data.map((d: any) => ({
        date: new Date(d.date),
        value: d.value,
      }));

      dividends.sort((a, b) => a.date.getTime() - b.date.getTime());

      return dividends;
    } catch (error) {
      console.error('Erro ao buscar dividendos', error);
      return [];
    }
  }
}
