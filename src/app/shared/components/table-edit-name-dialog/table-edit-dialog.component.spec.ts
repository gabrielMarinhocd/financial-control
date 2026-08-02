import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TableEditDialogComponent } from './table-edit-name-dialog.component';

describe('TableEditDialogComponent', () => {
  let component: TableEditDialogComponent;
  let fixture: ComponentFixture<TableEditDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<TableEditDialogComponent>>;

  const createDialogData = () => ({
    id: 1,
    name: 'Tabela Teste',
    description: 'Descrição inicial',
  });

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [TableEditDialogComponent, NoopAnimationsModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogRefSpy,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: createDialogData(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TableEditDialogComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('deve criar o componente corretamente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar os dados recebidos pelo diálogo', () => {
    expect(component.data).toEqual({
      id: 1,
      name: 'Tabela Teste',
      description: 'Descrição inicial',
    });
  });

  it('deve salvar os dados atuais do formulário', () => {
    component.data.name = 'Nova tabela';
    component.data.description = 'Nova descrição';

    component.save();

    expect(dialogRefSpy.close).toHaveBeenCalledOnceWith({
      id: 1,
      name: 'Nova tabela',
      description: 'Nova descrição',
    });
  });

  it('não deve criar outro objeto ao salvar, deve retornar a referência atual', () => {
    const dataReference = component.data;

    component.save();

    expect(dialogRefSpy.close).toHaveBeenCalledWith(dataReference);
  });

  it('deve cancelar e fechar o diálogo sem dados', () => {
    component.cancel();

    expect(dialogRefSpy.close).toHaveBeenCalledOnceWith(null);
  });

  it('deve atualizar o nome através do ngModel', () => {
    const input = fixture.nativeElement.querySelector(
      'input[matinput]'
    ) as HTMLInputElement;

    input.value = 'Nome atualizado';
    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.data.name).toBe('Nome atualizado');
  });

  it('deve chamar save ao clicar no botão Salvar', () => {
    spyOn(component, 'save');

    const button = fixture.nativeElement.querySelector(
      'button[color="primary"]'
    );

    button.click();

    expect(component.save).toHaveBeenCalled();
  });

  it('deve chamar cancel ao clicar no botão Cancelar', () => {
    spyOn(component, 'cancel');

    const buttons = fixture.nativeElement.querySelectorAll('button');

    buttons[0].click();

    expect(component.cancel).toHaveBeenCalled();
  });
});
