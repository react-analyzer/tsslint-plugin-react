import type { Context, ReportDescriptor } from "tsl";
import { dual, type unit } from "../lib/eff.ts";

export interface Reporter<Ctx extends Context = Context> {
  send: (descriptor: unit | null | ReportDescriptor) => void;
  sendOrElse: <TElse>(descriptor: unit | null | ReportDescriptor, cb: () => TElse) => unit | TElse;
}

export const send: {
  <Ctx extends Context = Context>(context: Ctx, descriptor: unit | null | ReportDescriptor): void;
  <Ctx extends Context = Context>(context: Ctx): (descriptor: unit | null | ReportDescriptor) => void;
} = dual(2, <Ctx extends Context = Context>(context: Ctx, descriptor: unit | null | ReportDescriptor) => {
  if (descriptor == null) return;
  return context.report(descriptor);
});

export const sendOrElse: {
  // dprint-ignore
  <Ctx extends Context, TElse>(context: Context, descriptor: unit | null | ReportDescriptor, cb: () => TElse): unit| TElse;
  // dprint-ignore
  <Ctx extends Context, TElse>(context: Context): (descriptor: unit | null | ReportDescriptor) => (cb: () => TElse) => unit | TElse;
} = dual(3, (context: Context, descriptor: unit | null | ReportDescriptor, cb: () => unknown) => {
  if (descriptor == null) return cb();
  return context.report(descriptor);
});

export function make<Ctx extends Context = Context>(context: Context): Reporter<Ctx> {
  return {
    send: (...args) => send(context, ...args),
    sendOrElse: (...args) => sendOrElse(context, ...args),
  };
}
