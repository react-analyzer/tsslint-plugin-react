import type { ReportDescriptor } from "tsl";
import { dual, unit } from "../lib/eff.ts";

interface Context {
  report(descriptor: ReportDescriptor): void;
}

export const report: {
  (context: Context, descriptor: unit | ReportDescriptor): void;
  (context: Context): (descriptor: unit | ReportDescriptor) => void;
} = dual(2, (context: Context, descriptor?: ReportDescriptor) => {
  if (descriptor == null) return;
  return context.report(descriptor);
});

export const reportOrElse: {
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
