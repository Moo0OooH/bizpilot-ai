import type { VerifGoLanguage } from "../types.ts";

type VerifGoCopy = Readonly<{
  history: string;
  inspector: string;
  settings: string;
  smartReminders: string;
  smartRemindersDescription: string;
  todayCta: string;
  todayReady: string;
  vehicle: string;
}>;

export const verifgoCopy: Readonly<Record<VerifGoLanguage, VerifGoCopy>> = {
  en: {
    history: "History",
    inspector: "Inspector mode",
    settings: "Settings",
    smartReminders: "Premium smart reminders",
    smartRemindersDescription:
      "One switch enables seasonal Quebec vehicle reminders when they matter.",
    todayCta: "Complete today's verification",
    todayReady: "Ready before your first ride.",
    vehicle: "Vehicle",
  },
  fr: {
    history: "Historique",
    inspector: "Mode inspection",
    settings: "Parametres",
    smartReminders: "Rappels intelligents Premium",
    smartRemindersDescription:
      "Un seul interrupteur active les rappels saisonniers utiles au bon moment.",
    todayCta: "Completer la verification du jour",
    todayReady: "Prete avant votre premiere course.",
    vehicle: "Vehicule",
  },
};
