export class PromptActionFuncionalities {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string
  ) {}

  transform(dados: any): PromptActionFuncionalities {
    if (dados) {
      this.id = dados.id;
      this.name = dados.name;
      this.description = dados.description;
    }

    return this;
  }
}
