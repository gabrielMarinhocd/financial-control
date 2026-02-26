export class DataTable {
  constructor(
    public id?: number,
    public date?: string,
    public sequencial_month?: number,
    public quotas_start_month?: string,
    public quotas_value?: number,
    public unit_proven?: number,
    public purchased_quotas?: number,
    public value_purchased_quotas?: number,
    public month_value_provent?: number,
    public purchased_quotas_proven?:number,
    public value_purchased_quotas_proven?:number,
    public accumulated_value_month?:number,
    public active?: number
  ) {}

  transform(dados: any): DataTable {
    if (dados) {
      this.id = dados.id;
      this.date = dados.date;
      this.sequencial_month = dados.sequencial_month;
      this.quotas_start_month = dados.quotas_start_month;
      this.quotas_value = dados.quotas_value;
      this.unit_proven = dados.unit_proven;
      this.purchased_quotas = dados.purchased_quotas;
      this.value_purchased_quotas = dados.value_purchased_quotas;
      this.month_value_provent = dados.month_value_provent;
      this.purchased_quotas_proven = dados.purchased_quotas_proven;
      this.value_purchased_quotas_proven = dados.value_purchased_quotas_proven;
      this.accumulated_value_month = dados.accumulated_value_month;
      this.active = dados.active;
    }
    return this;
  }
}