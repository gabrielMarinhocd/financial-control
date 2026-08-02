import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TableFinancialDialogComponent } from './table-financial-dialog.component';
import { DataTable } from '../../../models/data-table.model';

describe('TableFinancialDialogComponent', () => {
  let component: TableFinancialDialogComponent;
  let fixture: ComponentFixture<TableFinancialDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<TableFinancialDialogComponent>>;

  const createRow = () => ({
    date: '2026-08-01',
    sequencial_month: 1,
    quotas_start_month: 100,
    quotas_value: 10,
    purchased_quotas: 5,
    unit_proven: 1,
    purchased_quotas_proven: 2,
    value_purchased_quotas_proven: 20,
  });

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [TableFinancialDialogComponent, NoopAnimationsModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogRefSpy,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            row: createRow(),
            list: [],
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TableFinancialDialogComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o row com os dados recebidos', () => {
    expect(component.row.sequencial_month).toBe(1);

    expect(component.row.quotas_start_month).toBe(100);
  });

  it('deve preencher a data atual quando não existir data', () => {
    const today = new Date().toISOString().slice(0, 10);

    component.row.date = '';

    const newComponent = new TableFinancialDialogComponent(dialogRefSpy, {
      row: {},
      list: [],
    });

    expect(newComponent.row.date).toBe(today);
  });

  describe('calculatePurchaseValue', () => {
    it('deve calcular valor das cotas compradas', () => {
      component.row.purchased_quotas = 10;
      component.row.quotas_value = 15;

      component.calculatePurchaseValue();

      expect(component.row.value_purchased_quotas).toBe(150);
    });

    it('deve retornar zero quando valores forem inválidos', () => {
      component.row.purchased_quotas = null as any;
      component.row.quotas_value = undefined as any;

      component.calculatePurchaseValue();

      expect(component.row.value_purchased_quotas).toBe(0);
    });
  });

  describe('calculateMonthProvent', () => {
    it('deve calcular o valor do dividendo mensal', () => {
      component.row.quotas_start_month = 200;
      component.row.unit_proven = 2;

      component.calculateMonthProvent();

      expect(component.row.month_value_provent).toBe(400);
    });

    it('deve retornar zero quando não existir dividendo', () => {
      component.row.quotas_start_month = 100;
      component.row.unit_proven = null as any;

      component.calculateMonthProvent();

      expect(component.row.month_value_provent).toBe(0);
    });
  });

  describe('calculateAccumulated', () => {
    it('deve calcular o valor acumulado corretamente', () => {
      component.row.quotas_start_month = 100;
      component.row.purchased_quotas = 10;
      component.row.purchased_quotas_proven = 5;
      component.row.quotas_value = 20;

      component.calculateAccumulated();

      expect(component.row.accumulated_value_month).toBe(2300);
    });

    it('deve considerar valores vazios como zero', () => {
      component.row.quotas_start_month = undefined as any;
      component.row.purchased_quotas = undefined as any;
      component.row.purchased_quotas_proven = undefined as any;
      component.row.quotas_value = 20;

      component.calculateAccumulated();

      expect(component.row.accumulated_value_month).toBe(0);
    });
  });

  describe('calculateStartMonth', () => {
    it('deve buscar o mês anterior e calcular as cotas iniciais', () => {
      component.list = [
        {
          sequencial_month: 1,
          quotas_start_month: 100,
          purchased_quotas: 20,
          purchased_quotas_proven: 5,
        } as DataTable,
      ];

      component.row.sequencial_month = 2;

      component.calculateStartMonth();

      expect(component.row.quotas_start_month).toBe(125);
    });

    it('não deve alterar quando não existe mês anterior', () => {
      component.list = [];

      component.row.sequencial_month = 2;
      component.row.quotas_start_month = 50;

      component.calculateStartMonth();

      expect(component.row.quotas_start_month).toBe(50);
    });

    it('não deve calcular para primeiro mês', () => {
      component.row.sequencial_month = 1;
      component.row.quotas_start_month = 10;

      component.calculateStartMonth();

      expect(component.row.quotas_start_month).toBe(10);
    });
  });

  describe('save', () => {
    it('deve salvar quando não existe duplicidade', () => {
      spyOn(component, 'calculateAccumulated');

      component.list = [];

      component.save();

      expect(dialogRefSpy.close).toHaveBeenCalledWith(component.row);
    });

    it('não deve salvar meses sequenciais duplicados', () => {
      spyOn(window, 'alert');

      component.row.sequencial_month = 2;

      component.list = [
        {
          sequencial_month: 2,
          date: '2026-01-01',
        } as DataTable,
      ];

      component.save();

      expect(window.alert).toHaveBeenCalledWith(
        'Já existe um registro com este mês sequencial.'
      );

      expect(dialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('deve permitir edição do mesmo registro', () => {
      component.row.sequencial_month = 2;
      component.row.date = '2026-01-01';

      component.list = [
        {
          sequencial_month: 2,
          date: '2026-01-01',
        } as DataTable,
      ];

      component.save();

      expect(dialogRefSpy.close).toHaveBeenCalled();
    });
  });

  it('deve fechar diálogo ao cancelar', () => {
    component.close();

    expect(dialogRefSpy.close).toHaveBeenCalledWith();
  });
});
