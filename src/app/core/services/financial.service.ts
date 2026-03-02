import { Injectable } from '@angular/core';
import { Table } from '../../models/table.model';
import { environment } from '../../../env/enviroment';

@Injectable({
  providedIn: 'root',
})
export class FinancialService {
  private getKey(ticker: string): string {
    return `financial_${ticker}`;
  }

  async getQuote(ticker: string): Promise<number | null> {
    try {
      const response = await fetch(
        `https://brapi.dev/api/quote/${ticker}?token=${environment.brapiToken}`
      );

      const data = await response.json();

      return data?.results?.[0] || null;
    } catch (error) {
      console.error('Erro ao consultar cotação', error);
      return null;
    }
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
