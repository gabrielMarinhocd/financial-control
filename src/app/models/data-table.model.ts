export class DataTable {
  constructor(
    public date?: string,
    public description?: string,
    public type?: string,
    public quantity?: number,
    public price?: number,
    public amount?: number
  ) {}

  transform(dados: any): DataTable {
    if (dados) {
      this.date = dados.date;
      this.description = dados.description;
      this.type = dados.type;
      this.quantity = dados.quantity;
      this.price = dados.price;
      this.amount = dados.amount;
    }
    return this;
  }
}