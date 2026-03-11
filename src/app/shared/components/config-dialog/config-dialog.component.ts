import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-config-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    MatTabsModule
  ],
  templateUrl: './config-dialog.component.html',
  styleUrls: ['./config-dialog.component.scss']
})
export class ConfigDialogComponent {}