import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TableFinancialSimulationDialogComponent } from './table-financial-simulation-dialog.component';

describe('TableFinancialSimulationDialogComponent', () => {
  let component: TableFinancialSimulationDialogComponent;
  let fixture: ComponentFixture<TableFinancialSimulationDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<
    MatDialogRef<TableFinancialSimulationDialogComponent>
  >;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [TableFinancialSimulationDialogComponent, NoopAnimationsModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogRefSpy,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            list: [],
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TableFinancialSimulationDialogComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('deve carregar o último provento da tabela', () => {
      component.data = {
        list: [
          {
            sequencial_month: 1,
            unit_proven: 0.5,
          },
          {
            sequencial_month: 3,
            unit_proven: 1.2,
          },
          {
            sequencial_month: 2,
            unit_proven: 0.8,
          },
        ],
      };

      component.ngOnInit();

      expect(component.unitProvent).toBe(1.2);
    });

    it('deve usar zero quando não existir histórico', () => {
      component.data = {
        list: [],
      };

      component.unitProvent = 10;

      component.ngOnInit();

      expect(component.unitProvent).toBe(10);
    });

    it('não deve quebrar quando data for undefined', () => {
      component.data = undefined;

      expect(() => component.ngOnInit()).not.toThrow();
    });

    it('deve considerar mês sem sequencial como zero', () => {
      component.data = {
        list: [
          {
            unit_proven: 5,
          },
          {
            sequencial_month: 2,
            unit_proven: 10,
          },
        ],
      };

      component.ngOnInit();

      expect(component.unitProvent).toBe(10);
    });
  });

  describe('simulate', () => {
    it('deve retornar todas as configurações da simulação', () => {
      component.months = 24;
      component.quotasPerMonth = 10;
      component.increment = 2;
      component.useCurrentPrice = false;
      component.unitProvent = 1.5;

      component.simulate();

      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        months: 24,
        quotasPerMonth: 10,
        increment: 2,
        useCurrentPrice: false,
        unitProvent: 1.5,
      });
    });

    it('deve usar os valores padrões ao simular', () => {
      component.simulate();

      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        months: 12,
        quotasPerMonth: 0,
        increment: 0,
        useCurrentPrice: true,
        unitProvent: 0,
      });
    });
  });

  describe('cancel', () => {
    it('deve fechar o diálogo sem retornar dados', () => {
      component.cancel();

      expect(dialogRefSpy.close).toHaveBeenCalledWith();
    });
  });

  describe('validação dos campos', () => {
    it('deve permitir alterar meses da simulação', () => {
      component.months = 36;

      expect(component.months).toBe(36);
    });

    it('deve permitir desabilitar uso do preço atual', () => {
      component.useCurrentPrice = false;

      expect(component.useCurrentPrice).toBeFalse();
    });

    it('deve aceitar provento decimal', () => {
      component.unitProvent = 0.35;

      expect(component.unitProvent).toBe(0.35);
    });
  });
});
