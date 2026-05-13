import { Data } from "@angular/router";
import { DataTable } from "./data-table.model";

export class Table {
    constructor(
      public id?: number,
      public name?: string,
      public describe?: string,
      public colums?: string[],
      public data?: DataTable[],
      public active?: number,
      public lastDividend?: number,
      public dateLastDividend?: Date
    ) {}
  
    transform(dados: any): Table {
      if (dados) {
        this.id = dados.id;
        this.name = dados.name;
        this.describe = dados.describe;
        this.colums = dados.colums;
        this.active = dados.active;
        this.data = dados.data;
        this.lastDividend = dados.lastDividend;
        this.dateLastDividend= dados.dateLastDividend;
      }
      return this;
    }
  }