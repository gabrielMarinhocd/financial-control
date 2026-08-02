import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-table-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './table-create-dialog.component.html',
})
export class TableCreateDialogComponent {
  name: string = '';
  description: string = '';

  constructor(
    private readonly dialogRef: MatDialogRef<TableCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  save() {
    if (!this.name.trim()) return;

    this.dialogRef.close({
      name: this.name,
      description: this.description,
    });
  }

  close() {
    this.dialogRef.close();
  }
}