import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogRefSpy,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { name: 'João' },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve receber os dados do diálogo', () => {
    expect(component.data).toEqual({ name: 'João' });
    expect(component.data.name).toBe('João');
  });

  it('deve fechar o diálogo retornando true ao confirmar', () => {
    component.confirm();

    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('deve fechar o diálogo retornando false ao cancelar', () => {
    component.cancel();

    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });
});
