import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { DataTable } from '../../../models/data-table.model';
import { MaterialModule } from '../../material/material.module';
import { Table } from '../../../models/table.model';

@Component({
  selector: 'app-table-financial',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MaterialModule
  ],
  templateUrl: './table-financial.component.html',
  styleUrls: ['./table-financial.component.scss'],
})
export class TableFinancialComponent implements OnChanges {

  @Input() data: Table = new Table;
  name:string = this.data.name!;

  displayedColumns: string[] = ['date', 'description', 'type', 'amount'];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      console.log('Data recebida:', this.data);
    }
  }
}