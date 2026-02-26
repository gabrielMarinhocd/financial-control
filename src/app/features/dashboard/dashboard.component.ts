import { Component } from '@angular/core';
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
export class DashboardComponent {
  mxrf11: Table = new Table(
    1,
    'MXRF11',
    "Fundo Imobiliario", // describe
    undefined, // columns
    [
      new DataTable(
        '2026-02-01', // date
        1, // sequencial_month
        '208', // quotas_start_month
        9.4, // quotas_value
        0.10, // unit_proven
        18, // purchased_quotas
        169.20, // value_purchased_quotas
        20.80, // month_value_provent
        2, // purchased_quotas_proven
        18.8, // value_purchased_quotas_proven
        1955.20, // accumulated_value_month
        1 // active
      ),
    ],
    1
  );
}
