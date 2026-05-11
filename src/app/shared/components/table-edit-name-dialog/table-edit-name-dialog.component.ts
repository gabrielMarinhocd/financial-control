import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-edit-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './table-edit-name-dialog.component.html',
  styleUrls: ['./table-edit-name-dialog.component.scss'],
})
export class TableEditDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<TableEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  save() {
    this.dialogRef.close(this.data);
  }

  cancel() {
    this.dialogRef.close(null);
  }
}