import type { VerifGoLanguage } from "../types.ts";

type VerifGoCopy = Readonly<{
  history: string;
  inspector: string;
  settings: string;
  todayCta: string;
  todayReady: string;
  vehicle: string;
}>;

export const verifgoCopy: Readonly<Record<VerifGoLanguage, VerifGoCopy>> = {
  en: {
    history: "History",
    inspector: "Inspector mode",
    settings: "Settings",
    todayCta: "Complete today's verification",
    todayReady: "Ready before your first ride.",
    vehicle: "Vehicle",
  },
  fr: {
    history: "Historique",
    inspector: "Mode inspection",
    settings: "Parametres",
    todayCta: "Completer la verification du jour",
    todayReady: "Prete avant votre premiere course.",
    vehicle: "Vehicule",
  },
};
