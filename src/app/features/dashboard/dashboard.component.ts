import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableFinancialComponent } from '../../shared/components/table-financial/table-financial.component';
import { DataTable} from '../../models/data-table.model';
import { MaterialModule } from '../../shared/material/material.module';
import { Table } from '../../models/table.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TableFinancialComponent, MaterialModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {

  mxrf11: Table = new Table(
    1,
    'MXRF11',  
    undefined, // describe
    undefined, // colums
    [
      new DataTable(
        '2026-02-01',
        'Compra MXRF11',
        'BUY',
        100,
        10.00,
        1000
      ),
      new DataTable(
        '2026-02-05',
        'Venda MXRF11',
        'SELL',
        50,
        11.00,
        550
      ),
      new DataTable(
        '2026-02-10',
        'Dividendo MXRF11',
        'DIVIDEND',
        100,
        0.12,
        12
      )
    ],
    1
  );


}