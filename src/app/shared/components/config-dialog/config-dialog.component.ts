import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-config-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, MatTabsModule],
  templateUrl: './config-dialog.component.html',
  styleUrls: ['./config-dialog.component.scss'],
})
export class ConfigDialogComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private snackBar: MatSnackBar) {}

  exportData() {
    const data = localStorage.getItem('financial_tables');

    if (!data) {
      this.snackBar.open('Nenhum dado encontrado', 'Fechar', {
        duration: 3000,
      });
      return;
    }

    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'financial-backup.json';
    a.click();

    window.URL.revokeObjectURL(url);

    this.snackBar.open('Backup exportado com sucesso', 'OK', {
      duration: 3000,
    });
  }

  importData() {
    this.fileInput.nativeElement.click();
  }

  handleFile(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        localStorage.setItem('financial_tables', JSON.stringify(json));

        this.snackBar.open('Dados importados com sucesso', 'Recarregar', {
          duration: 3000,
        });

        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } catch (error) {
        this.snackBar.open('Arquivo inválido', 'Fechar', {
          duration: 3000,
        });
      }
    };

    reader.readAsText(file);
  }
}
