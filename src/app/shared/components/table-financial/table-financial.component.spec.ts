import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TableFinancialComponent } from './table-financial.component';
import { FinancialService } from '../../../core/services/financial.service';
import { HttpService } from '../../../core/services/http.service';

describe('TableFinancialComponent', () => {
  let component: TableFinancialComponent;
  let fixture: ComponentFixture<TableFinancialComponent>;

  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let httpSpy: jasmine.SpyObj<HttpService>;
  let financialSpy: jasmine.SpyObj<FinancialService>;
  let snackSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    httpSpy = jasmine.createSpyObj('HttpService', ['getQuote', 'getDividends']);

    financialSpy = jasmine.createSpyObj('FinancialService', ['updateTable']);

    snackSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [TableFinancialComponent, NoopAnimationsModule],

      providers: [
        {
          provide: MatDialog,
          useValue: dialogSpy,
        },

        {
          provide: HttpService,
          useValue: httpSpy,
        },

        {
          provide: FinancialService,
          useValue: financialSpy,
        },

        {
          provide: MatSnackBar,
          useValue: snackSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TableFinancialComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('deve criar componente', () => {
    expect(component).toBeTruthy();
  });

  describe('totalQuotas', () => {
    it('deve calcular total de cotas', () => {
      component.data.data = [
        {
          quotas_start_month: 100,
          purchased_quotas: 20,
          purchased_quotas_proven: 5,
        } as any,
      ];

      expect(component.totalQuotas).toBe(125);
    });

    it('deve retornar zero sem dados', () => {
      component.data.data = [];

      expect(component.totalQuotas).toBe(0);
    });
  });

  describe('totalValue', () => {
    it('deve retornar valor acumulado do último registro', () => {
      component.dataSource.data = [
        {
          accumulated_value_month: 1000,
        } as any,

        {
          accumulated_value_month: 2500,
        } as any,
      ];

      expect(component.totalValue).toBe(2500);
    });
  });

  describe('totalDividends', () => {
    it('deve somar dividendos', () => {
      component.dataSource.data = [
        {
          month_value_provent: 10,
        } as any,

        {
          month_value_provent: 20,
        } as any,
      ];

      expect(component.totalDividends).toBe(30);
    });
  });

  describe('averagePrice', () => {
    it('deve calcular preço médio', () => {
      component.dataSource.data = [
        {
          quotas_value: 10,
          quotas_start_month: 10,
          purchased_quotas: 10,
          value_purchased_quotas: 100,
          purchased_quotas_proven: 0,
          value_purchased_quotas_proven: 0,
        } as any,
      ];

      expect(component.averagePrice).toBe(10);
    });

    it('deve retornar zero sem cotas', () => {
      component.dataSource.data = [];

      expect(component.averagePrice).toBe(0);
    });
  });

  describe('simulateData', () => {
    it('deve gerar meses simulados', () => {
      component.data.data = [
        {
          quotas_start_month: 100,
          purchased_quotas: 0,
          purchased_quotas_proven: 0,
          quotas_value: 10,
          unit_proven: 1,
          sequencial_month: 1,
        } as any,
      ];

      const result = component.simulateData({
        months: 3,
        quotasPerMonth: 10,
        increment: 0,
        useCurrentPrice: false,
        unitProvent: 1,
      });

      expect(result).toHaveSize(3);

      expect(result[0].purchased_quotas).toBe(10);
    });

    it('deve avisar quando não existir histórico', () => {
      component.data.data = [];

      component.simulateData({
        months: 1,
        quotasPerMonth: 10,
      });

      expect(snackSpy.open).toHaveBeenCalled();
    });
  });

  describe('clearSimulation', () => {
    it('deve limpar simulação', () => {
      component.data.data = [
        {
          id: 1,
        } as any,
      ];

      component.dataSource.data = [
        {
          id: 1,
        } as any,

        {
          id: 2,
        } as any,
      ];

      component.simulationActive = true;

      component.clearSimulation();

      expect(component.simulationActive).toBeFalse();

      expect(component.dataSource.data).toHaveSize(1);
    });
  });

  describe('getTotalQuotasRow', () => {
    it('deve calcular total de cotas da linha', () => {
      const row: any = {
        quotas_start_month: 50,
        purchased_quotas: 10,
        purchased_quotas_proven: 5,
      };

      expect(component.getTotalQuotasRow(row)).toBe(65);
    });
  });

  describe('checkMobile', () => {
    it('deve identificar mobile', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(500);

      component.checkMobile();

      expect(component.isMobile).toBeTrue();
    });
  });
});
