export type ActionHandler = (ctx: any, parameters?: any) => void;

export const actions: Record<string, ActionHandler> = {
  alerta: (ctx, parameters) => {
    ctx.alerta(parameters);
  },
  addTable: (ctx, parameters) => {
    ctx.addTable(parameters);
  },
};
