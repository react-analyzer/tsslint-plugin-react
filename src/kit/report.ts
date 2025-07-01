import type { Context, ReportDescriptor } from "tsl";
import { dual, type unit } from "../lib/eff.ts";

export interface Reporter<Ctx extends Context = Context> {
  send: (descriptor: unit | ReportDescriptor) => void;
  sendOrElse: <TElse>(descriptor: unit | ReportDescriptor, cb: () => TElse) => unit | TElse;
}

export const send: {
  <TCtx extends Context = Context>(context: TCtx, descriptor: unit | ReportDescriptor): void;
  <TCtx extends Context = Context>(context: TCtx): (descriptor: unit | ReportDescriptor) => void;
} = dual(2, <TCtx extends Context = Context>(context: TCtx, descriptor: unit | ReportDescriptor) => {
  if (descriptor == null) return;
  return context.report(descriptor);
});

export const sendOrElse: {
  <TCtx extends Context, TElse>(context: Context, descriptor: unit | ReportDescriptor, cb: () => TElse): unit | TElse;
  // dprint-ignore
  <TCtx extends Context, TElse>(context: Context): (descriptor: unit | ReportDescriptor) => (cb: () => TElse) => unit | TElse;
} = dual(
  3,
  (
    context: Context,
    descriptor: unit | ReportDescriptor,
    cb: () => unknown,
  ) =>
    descriptor == null
      ? cb()
      : context.report(descriptor),
);

export function make<TCtx extends Context = Context>(context: Context): Reporter<TCtx> {
  return {
    send: (...args) => send(context, ...args),
    sendOrElse: (...args) => sendOrElse(context, ...args),
  };
}
