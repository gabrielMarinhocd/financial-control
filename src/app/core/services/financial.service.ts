import { Injectable } from '@angular/core';
import { DataTable} from '../../models/data-table.model';

@Injectable({
  providedIn: 'root'
})
export class FinancialService {

  private getKey(ticker: string): string {
    return `financial_${ticker}`;
  }

  getData(ticker: string): DataTable[] {
    const data = localStorage.getItem(this.getKey(ticker));
    return data ? JSON.parse(data) : [];
  }

  saveData(ticker: string, entries: DataTable[]): void {
    localStorage.setItem(this.getKey(ticker), JSON.stringify(entries));
  }

  addEntry(ticker: string, entry: DataTable ): void {
    const data = this.getData(ticker);
    data.push(entry);
    this.saveData(ticker, data);
  }
}