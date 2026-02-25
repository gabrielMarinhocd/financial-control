import { DataTable } from "./data-table.model";

export class Table {
    constructor(
      public id?: number,
      public name?: string,
      public describe?: string,
      public colums?: string[],
      public data?: DataTable[],
      public active?: number
    ) {}
  
    transform(dados: any): Table {
      if (dados) {
        this.id = dados.id;
        this.name = dados.name;
        this.describe = dados.describe;
        this.colums = dados.colums;
        this.active = dados.active;
        this.data = dados.data;
      }
      return this;
    }
  }