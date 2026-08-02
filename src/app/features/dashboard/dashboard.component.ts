import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

import { TableFinancialComponent } from '../../shared/components/table-financial/table-financial.component';
import { DataTable } from '../../models/data-table.model';
import { MaterialModule } from '../../shared/material/material.module';
import { Table } from '../../models/table.model';

import { FinancialService } from '../../core/services/financial.service';
import { HttpService } from '../../core/services/http.service';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TableCreateDialogComponent } from '../../shared/components/table-create-dialog/table-create-dialog.component';
import { ConfigDialogComponent } from '../../shared/components/config-dialog/config-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { TableEditDialogComponent } from '../../shared/components/table-edit-name-dialog/table-edit-name-dialog.component';
import { actions } from '../../core/services/handlers/handlers';
import { PromptActionFuncionalities } from '../../models/prompt-action-funcionalities';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TableFinancialComponent, MaterialModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  tables: Table[] = [];
  selectedTable?: Table;

  isMobile = false;

  isRecording = false;
  isProcessingAudio = false;

  promptActionFuncionalities: PromptActionFuncionalities =
    new PromptActionFuncionalities();

  private mediaRecorder?: MediaRecorder;
  private audioChunks: Blob[] = [];

  constructor(
    private readonly financialService: FinancialService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly httpService: HttpService
  ) {}

  executar(nome: string) {
    if (nome != '') return;
    actions[nome]?.(this);
  }

  ngOnInit(): void {
    this.checkScreen();

    const storedTables = localStorage.getItem('financial_tables');

    if (storedTables) {
      const parsed = JSON.parse(storedTables);

      this.tables = parsed.map((t: any) => new Table().transform(t));

      sessionStorage.setItem('tables', JSON.stringify(this.tables));
    } else {
      const defaultTable = this.createDefaultTable();

      this.tables = [defaultTable];

      this.financialService.createTable(this.tables);

      sessionStorage.setItem('tables', JSON.stringify(this.tables));
    }

    if (this.tables.length > 0) {
      this.selectedTable = this.tables[0];
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreen();
  }

  checkScreen() {
    this.isMobile = window.innerWidth <= 768;
  }

  selectTable(table: Table) {
    this.selectedTable = table;
  }

  createDefaultTable(): Table {
    return new Table(
      1,
      'MXRF11',
      'Teste Inicial',
      undefined,
      [
        new DataTable(
          1,
          '2026-02-01',
          1,
          208,
          9.4,
          0.1,
          18,
          169.2,
          20.8,
          2,
          18.8,
          2143.2,
          1
        ),
      ],
      1
    );
  }

  addTable() {
    const dialogRef = this.dialog.open(TableCreateDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      const newTable = new Table(
        Date.now(),
        result.name.toUpperCase(),
        result.description,
        undefined,
        [],
        1
      );

      this.tables.push(newTable);

      this.selectedTable = newTable;

      sessionStorage.setItem('tables', JSON.stringify(this.tables));

      this.financialService.updateTable(this.tables);
    });
  }

  openConfig() {
    this.dialog.open(ConfigDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
    });
  }

  removeTable(table: Table) {
    const stored = localStorage.getItem('financial_tables');

    if (!stored) return;

    const data: Table[] = JSON.parse(stored);

    const index = data.findIndex((t) => t.id === table.id);

    if (index === -1) return;

    data.splice(index, 1);

    localStorage.setItem('financial_tables', JSON.stringify(data));

    sessionStorage.setItem('tables', JSON.stringify(data));

    this.tables = data;

    this.selectedTable = this.tables.length ? this.tables[0] : undefined;

    this.financialService.updateTable(this.tables);
  }

  openDeleteDialog(table: Table) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { name: table.name },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        if (table.id == null) {
          console.error('Tabela sem ID', table);

          this.snackBar.open('Erro!', 'OK', {
            duration: 3000,
            panelClass: ['snackbar-error'],
          });

          return;
        }

        this.tables = this.financialService.deleteTable(table.id);

        this.selectedTable = this.tables.length ? this.tables[0] : undefined;

        this.snackBar.open('Removido com sucesso!', 'OK', {
          duration: 3000,
          panelClass: ['snackbar-success'],
        });
      }
    });
  }

  openEditDialog(table: Table) {
    const dialogRef = this.dialog.open(TableEditDialogComponent, {
      width: '400px',
      data: { ...table },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      const index = this.tables.findIndex((t) => t.id === table.id);

      if (index === -1) return;

      this.tables[index].name = result.name;
      this.tables[index].describe = result.description;

      this.financialService.updateTable(this.tables);

      this.snackBar.open('Tabela atualizada!', 'OK', {
        duration: 3000,
        panelClass: ['snackbar-success'],
      });
    });
  }

  async toggleRecording() {
    if (this.isProcessingAudio) {
      return;
    }

    if (this.isRecording) {
      this.stopRecording();
    } else {
      await this.startRecording();
    }
  }

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      this.audioChunks = [];

      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, {
          type: 'audio/webm',
        });

        console.log('Áudio gravado:', audioBlob);

        this.sendAudio(audioBlob);

        stream.getTracks().forEach((track) => track.stop());
      };

      this.mediaRecorder.start();

      this.isRecording = true;

      this.snackBar.open('Gravando áudio...', 'OK', {
        duration: 2000,
      });
    } catch (error) {
      console.error(error);

      this.snackBar.open('Erro ao acessar microfone', 'OK', {
        duration: 3000,
        panelClass: ['snackbar-error'],
      });
    }
  }

  stopRecording() {
    this.mediaRecorder?.stop();

    this.isRecording = false;

    this.snackBar.open('Processando áudio...', 'OK', {
      duration: 3000,
    });
  }

  sendAudio(audioBlob: Blob) {
    this.isProcessingAudio = true;

    const formData = new FormData();

    // DEFINE EXTENSÃO PELO MIME TYPE
    let extension = 'webm';

    if (audioBlob.type.includes('mp4')) {
      extension = 'm4a';
    } else if (audioBlob.type.includes('mpeg')) {
      extension = 'mp3';
    } else if (audioBlob.type.includes('wav')) {
      extension = 'wav';
    } else if (audioBlob.type.includes('ogg')) {
      extension = 'ogg';
    }

    const fileName = `audio-${Date.now()}.${extension}`;

    formData.append('file', audioBlob, fileName);

    // =========================
    // DEBUG DO ÁUDIO (IMPORTANTE)
    // =========================
    // console.log('========== DEBUG AUDIO ==========');
    // console.log('Tipo MIME:', audioBlob.type);
    // console.log('Tamanho (bytes):', audioBlob.size);
    // console.log('Tamanho (KB):', (audioBlob.size / 1024).toFixed(2));
    // console.log('Arquivo enviado:', fileName);
    // console.log('É provável áudio real? ', audioBlob.size > 1000);
    // console.log('=================================');

    this.snackBar.open('Transcrevendo áudio... Aguarde.', 'OK', {
      duration: 5000,
    });

    this.httpService
      .transcriptionAudio(formData)
      .pipe(
        finalize(() => {
          this.isProcessingAudio = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          this.promptActionFuncionalities = response;

          const actionName = response?.execute?.name;
          const parameters = response?.execute?.parameters;

          if (actionName) {
            actions[actionName]?.(this, parameters);
          }

          this.snackBar.open('Áudio transcrito com sucesso!', 'OK', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });
        },

        error: (err) => {
          console.error('Erro completo:', err);
          console.error('Erro backend:', err?.error);

          this.snackBar.open('Erro ao transcrever áudio', 'OK', {
            duration: 3000,
            panelClass: ['snackbar-error'],
          });
        },
      });
  }

  alerta(...message: any) {
    alert(message);
  }
}
