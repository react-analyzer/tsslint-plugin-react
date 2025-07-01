import type { Context, ReportDescriptor } from "tsl";
import { dual, unit } from "../lib/eff.ts";

export const send: {
  (context: Context, descriptor: unit | ReportDescriptor): void;
  (context: Context): (descriptor: unit | ReportDescriptor) => void;
} = dual(2, (context: Context, descriptor?: ReportDescriptor) => {
  if (descriptor == null) return;
  return context.report(descriptor);
});

export const sendOrElse: {
  <TElse>(context: Context, descriptor: unit | ReportDescriptor, cb: () => TElse): unit | TElse;
  <TElse>(context: Context): (descriptor: unit | ReportDescriptor) => (cb: () => TElse) => unit | TElse;
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

export interface Report {
  send: (descriptor: unit | ReportDescriptor) => void;
  sendOrElse: <TElse>(descriptor: unit | ReportDescriptor, cb: () => TElse) => unit | TElse;
}

export function make(context: Context): Report {
  return {
    send: (...args) => send(context, ...args),
    sendOrElse: (...args) => sendOrElse(context, ...args),
  };
}
