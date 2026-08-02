import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TableCreateDialogComponent } from './table-create-dialog.component';

describe('TableCreateDialogComponent', () => {
  let component: TableCreateDialogComponent;
  let fixture: ComponentFixture<TableCreateDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<TableCreateDialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [TableCreateDialogComponent, NoopAnimationsModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogRefSpy,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { id: 1 },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TableCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve receber os dados injetados', () => {
    expect(component.data).toEqual({ id: 1 });
  });

  describe('save()', () => {
    it('não deve fechar o diálogo quando o nome estiver vazio', () => {
      component.name = '';
      component.description = 'Descrição';

      component.save();

      expect(dialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('não deve fechar o diálogo quando o nome possuir apenas espaços', () => {
      component.name = '     ';
      component.description = 'Descrição';

      component.save();

      expect(dialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('deve fechar o diálogo com os dados informados', () => {
      component.name = 'Nova Tabela';
      component.description = 'Descrição da tabela';

      component.save();

      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        name: 'Nova Tabela',
        description: 'Descrição da tabela',
      });
    });

    it('deve manter os espaços do nome ao enviar', () => {
      component.name = '  Nova Tabela  ';
      component.description = 'Descrição';

      component.save();

      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        name: '  Nova Tabela  ',
        description: 'Descrição',
      });
    });
  });

  describe('close()', () => {
    it('deve fechar o diálogo sem parâmetros', () => {
      component.close();

      expect(dialogRefSpy.close).toHaveBeenCalledWith();
    });
  });
});
