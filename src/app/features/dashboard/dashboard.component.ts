import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableFinancialComponent } from '../../shared/components/table-financial/table-financial.component';
import { DataTable } from '../../models/data-table.model';
import { MaterialModule } from '../../shared/material/material.module';
import { Table } from '../../models/table.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TableFinancialComponent, MaterialModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  mxrf11: any;

  ngOnInit(): void {
    const storedData = localStorage.getItem('financial_MXRF11');
    
    if (storedData) {
      this.mxrf11 = new Table().transform(JSON.parse(storedData));
    } else {
      this.mxrf11 = new Table(
        1,
        'MXRF11',
        'Fundo Imobiliario',
        undefined, 
        [
          new DataTable(
            1,
            '2026-02-01',
            1,
            '208',
            9.4,
            0.10,
            18,
            169.20,
            20.80,
            2,
            18.8,
            1955.20,
            1
          ),
        ],
        1
      );
      
      localStorage.setItem('financial_MXRF11', JSON.stringify(this.mxrf11));
    }
  }
}