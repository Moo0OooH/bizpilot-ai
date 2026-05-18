import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputPath =
  "E:/bizpilot-ai/artifacts/phase18/BizPilot_Phase18_Founder_CRM_Template.xlsx";

const workbook = Workbook.create();
const dashboard = workbook.worksheets.add("Dashboard");
const pipeline = workbook.worksheets.add("Founder CRM");
const weekly = workbook.worksheets.add("Weekly Loop");
const retention = workbook.worksheets.add("Pilot Retention");
const objections = workbook.worksheets.add("Objections");
const setup = workbook.worksheets.add("Concierge Setup");

const colors = {
  accent: "#0F766E",
  amber: "#B45309",
  blue: "#1D4ED8",
  border: "#D4D4D8",
  dark: "#18181B",
  green: "#047857",
  light: "#F8FAFC",
  muted: "#52525B",
  red: "#B91C1C",
  softGreen: "#ECFDF5",
  white: "#FFFFFF",
};

function title(sheet, range, text, subtitle) {
  sheet.showGridLines = false;
  const titleRange = sheet.getRange(range);
  titleRange.merge();
  titleRange.values = [[text]];
  titleRange.format = {
    fill: colors.dark,
    font: { bold: true, color: colors.white, size: 16 },
    horizontalAlignment: "left",
    verticalAlignment: "middle",
  };
  if (subtitle) {
    const subtitleRange = sheet.getRange("A2:H2");
    subtitleRange.merge();
    subtitleRange.values = [[subtitle]];
    subtitleRange.format = {
      fill: colors.light,
      font: { color: colors.muted, size: 10 },
      wrapText: true,
    };
  }
}

function styleHeader(range) {
  range.format = {
    fill: colors.accent,
    font: { bold: true, color: colors.white },
    horizontalAlignment: "center",
    verticalAlignment: "middle",
    wrapText: true,
  };
}

function styleBody(range) {
  range.format = {
    border: {
      bottom: { color: colors.border, style: "continuous", weight: "thin" },
      left: { color: colors.border, style: "continuous", weight: "thin" },
      right: { color: colors.border, style: "continuous", weight: "thin" },
      top: { color: colors.border, style: "continuous", weight: "thin" },
    },
    font: { color: colors.dark, size: 10 },
    verticalAlignment: "top",
    wrapText: true,
  };
}

function setWidths(sheet, widths) {
  widths.forEach((width, index) => {
    sheet.getRangeByIndexes(0, index, 1, 1).format.columnWidthPx = width;
  });
}

function addValidation(sheet, range, values) {
  sheet.getRange(range).dataValidation = {
    rule: { type: "list", values },
  };
}

title(
  dashboard,
  "A1:H1",
  "BizPilot Phase 18 Pilot Dashboard",
  "Track founder-led validation only: outreach, demos, setup, quote link placement, weekly usage, owner language, and willingness to pay.",
);
dashboard.getRange("A4:B11").values = [
  ["Metric", "Value"],
  ["Total prospects", "=COUNTA('Founder CRM'!A5:A104)"],
  ["Strong or good fit", '=COUNTIF(\'Founder CRM\'!G5:G104,"Strong fit")+COUNTIF(\'Founder CRM\'!G5:G104,"Good fit")'],
  ["Demos scheduled/done", '=COUNTIF(\'Founder CRM\'!K5:K104,"Scheduled")+COUNTIF(\'Founder CRM\'!K5:K104,"Done")'],
  ["Pilot customers", '=COUNTIF(\'Founder CRM\'!O5:O104,"Pilot active")+COUNTIF(\'Founder CRM\'!O5:O104,"Payment-ready")'],
  ["Payment-ready", '=COUNTIF(\'Founder CRM\'!O5:O104,"Payment-ready")'],
  ["Paying", '=COUNTIF(\'Founder CRM\'!O5:O104,"Paying")'],
  ["Needs follow-up this week", '=COUNTIF(\'Founder CRM\'!M5:M104,"<= "&TODAY()+7)'],
];
styleHeader(dashboard.getRange("A4:B4"));
styleBody(dashboard.getRange("A5:B11"));
dashboard.getRange("A13:H16").values = [
  ["Phase 18 guardrails", "", "", "", "", "", "", ""],
  ["Use this workbook before building more product. If a pilot asks for booking, billing, WhatsApp/SMS automation, or full CRM behavior, log it as an objection/request instead of building it.", "", "", "", "", "", "", ""],
  ["Weekly target", "5 personalized outreach attempts", "2 meaningful replies", "1 demo attempt", "all owner wording logged", "quote link placement checked", "AI draft usage checked", "retention notes updated"],
  ["Phase 18 success", "3 paying/payment-ready cleaning businesses", "repeat weekly usage", "real quote submissions", "AI drafts save owner time", "one strong testimonial/proof", "no scope expansion", "retention signal"],
];
dashboard.getRange("A13:H13").merge();
dashboard.getRange("A14:H14").merge();
dashboard.getRange("A13:H16").format = { wrapText: true };
styleHeader(dashboard.getRange("A13:H13"));
styleBody(dashboard.getRange("A14:H16"));
setWidths(dashboard, [180, 150, 150, 150, 150, 150, 150, 150]);

title(
  pipeline,
  "A1:Q1",
  "Founder CRM",
  "One row per cleaning business. Keep it simple, founder-owned, and honest.",
);
const pipelineHeaders = [
  "Business name",
  "Owner/contact",
  "City / area",
  "Website",
  "Instagram / Facebook",
  "Contact channel",
  "Fit score",
  "Current quote process",
  "Current tools",
  "Public link placement idea",
  "Demo status",
  "Contacted date",
  "Follow-up date",
  "Objections / exact owner words",
  "Pilot status",
  "Willingness to pay",
  "Next action",
];
pipeline.getRange("A4:Q4").values = [pipelineHeaders];
styleHeader(pipeline.getRange("A4:Q4"));
styleBody(pipeline.getRange("A5:Q104"));
pipeline.freezePanes.freezeRows(4);
setWidths(pipeline, [180, 150, 120, 170, 170, 120, 110, 220, 150, 190, 120, 110, 110, 260, 130, 150, 220]);
addValidation(pipeline, "G5:G104", ["Strong fit", "Good fit", "Maybe", "Not now"]);
addValidation(pipeline, "K5:K104", ["Not contacted", "Contacted", "Replied", "Scheduled", "Done", "No-show", "Declined"]);
addValidation(pipeline, "O5:O104", ["Prospect", "Demo sent", "Pilot active", "Payment-ready", "Paying", "Not now", "Bad fit"]);
addValidation(pipeline, "P5:P104", ["Unknown", "No", "$29-$49/mo", "$49-$79/mo", "$79+/mo", "Setup fee accepted"]);
pipeline.getRange("A5:Q7").values = [
  ["Spark & Shine Cleaning Co.", "Owner name", "Downtown", "https://example.com", "@example", "Instagram DM", "Strong fit", "Customers DM short quote questions", "Phone + Instagram", "Instagram bio + Google Business Profile", "Not contacted", null, null, "", "Prospect", "Unknown", "Send personalized demo offer"],
  ["", "", "", "", "", "", "", "", "", "", "", null, null, "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", "", null, null, "", "", "", ""],
];
pipeline.getRange("L5:M104").setNumberFormat("yyyy-mm-dd");

title(
  weekly,
  "A1:J1",
  "Weekly Customer Discovery Loop",
  "Record activity every week. The goal is learning and paid validation, not vanity activity.",
);
weekly.getRange("A4:J4").values = [[
  "Week starting",
  "Outreach attempts",
  "Meaningful replies",
  "Conversations",
  "Demo attempts",
  "Demos completed",
  "Top objection",
  "Exact owner language",
  "Decision / learning",
  "Next week focus",
]];
styleHeader(weekly.getRange("A4:J4"));
styleBody(weekly.getRange("A5:J56"));
weekly.freezePanes.freezeRows(4);
setWidths(weekly, [110, 120, 120, 120, 120, 120, 180, 260, 240, 220]);
weekly.getRange("A5:A56").setNumberFormat("yyyy-mm-dd");

title(
  retention,
  "A1:N1",
  "Pilot Retention",
  "One row per weekly pilot check-in. Retention signal beats feature volume.",
);
retention.getRange("A4:N4").values = [[
  "Business name",
  "Week",
  "Quote link placements",
  "Real quote submissions",
  "Owner reviewed leads",
  "AI drafts generated",
  "AI drafts copied/edited",
  "Follow-ups completed",
  "Booked jobs influenced",
  "Owner value statement",
  "Friction / churn risk",
  "Requested feature",
  "Founder action",
  "Retention status",
]];
styleHeader(retention.getRange("A4:N4"));
styleBody(retention.getRange("A5:N104"));
retention.freezePanes.freezeRows(4);
setWidths(retention, [180, 90, 140, 140, 130, 130, 150, 140, 140, 260, 220, 180, 220, 130]);
addValidation(retention, "N5:N104", ["Healthy", "Watch", "At risk", "Churned", "Unknown"]);

title(
  objections,
  "A1:H1",
  "Objection Library",
  "Do not build around every request. Record exact owner wording and decide whether it changes positioning, onboarding, pricing, or product.",
);
objections.getRange("A4:H4").values = [[
  "Date",
  "Business",
  "Objection / request",
  "Exact owner wording",
  "Category",
  "Response used",
  "Outcome",
  "Decision",
]];
styleHeader(objections.getRange("A4:H4"));
styleBody(objections.getRange("A5:H104"));
objections.freezePanes.freezeRows(4);
setWidths(objections, [110, 160, 220, 280, 130, 260, 150, 210]);
addValidation(objections, "E5:E104", ["Price", "Trust", "AI concern", "Setup time", "Feature request", "Bad fit", "Timing"]);
objections.getRange("A5:A104").setNumberFormat("yyyy-mm-dd");

title(
  setup,
  "A1:H1",
  "Concierge Setup Checklist",
  "Use this for each first customer. The founder helps manually; self-serve onboarding stays deferred.",
);
setup.getRange("A4:H4").values = [[
  "Step",
  "Owner",
  "Status",
  "Due date",
  "Evidence / link",
  "Notes",
  "Customer confirmed",
  "Risk if skipped",
]];
styleHeader(setup.getRange("A4:H4"));
const setupRows = [
  ["Confirm cleaning business fit", "Founder", "Open", null, "", "1-10 people, quote requests from DMs/forms/calls, owner manually replies.", "No", "Bad-fit pilot creates noisy feedback."],
  ["Collect services and service areas", "Founder", "Open", null, "", "Move-out, deep cleaning, recurring, commercial if applicable.", "No", "Public quote page feels generic."],
  ["Configure business profile and branding", "Founder", "Open", null, "", "Name, slug, colors, logo URL if available.", "No", "Owner may not trust/share link."],
  ["Configure public quote questions", "Founder", "Open", null, "", "Keep cleaning-first; do not overbuild conditional logic.", "No", "Leads may lack useful details."],
  ["Place quote link in two channels", "Founder + owner", "Open", null, "", "Website, Instagram bio, Facebook, Google Business Profile, saved DM reply.", "No", "No real submissions means no validation."],
  ["Submit one test quote request", "Founder", "Open", null, "", "Use demo-safe data, verify lead appears.", "No", "Broken public flow reaches customer."],
  ["Show dashboard Magic Moment", "Founder", "Open", null, "", "Lead queue, quote detail, AI draft, follow-up action.", "No", "Owner does not understand value."],
  ["Explain owner-reviewed AI boundary", "Founder", "Open", null, "", "Nothing sends automatically; no prices/booking confirmations invented.", "No", "Trust risk."],
  ["Schedule weekly check-in", "Founder + owner", "Open", null, "", "Track quote submissions, draft use, objections, retention.", "No", "No retention learning loop."],
  ["Record willingness to pay", "Founder", "Open", null, "", "Setup fee and monthly price response.", "No", "No commercial validation."],
];
setup.getRange(`A5:H${4 + setupRows.length}`).values = setupRows;
styleBody(setup.getRange("A5:H104"));
setup.freezePanes.freezeRows(4);
setWidths(setup, [210, 130, 110, 110, 170, 270, 130, 220]);
addValidation(setup, "C5:C104", ["Open", "In progress", "Done", "Blocked", "Accepted risk"]);
addValidation(setup, "G5:G104", ["No", "Yes", "N/A"]);
setup.getRange("D5:D104").setNumberFormat("yyyy-mm-dd");

for (const sheet of [dashboard, pipeline, weekly, retention, objections, setup]) {
  const used = sheet.getUsedRange();
  used.format.wrapText = true;
  used.format.verticalAlignment = "top";
}

const errorScan = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 50 },
});
if (errorScan.ndjson.includes("#REF!") || errorScan.ndjson.includes("#DIV/0!")) {
  throw new Error(`Formula errors detected: ${errorScan.ndjson}`);
}

for (const sheetName of [
  "Dashboard",
  "Founder CRM",
  "Weekly Loop",
  "Pilot Retention",
  "Objections",
  "Concierge Setup",
]) {
  await workbook.render({ sheetName, autoCrop: "all", scale: 1 });
}

await fs.mkdir("E:/bizpilot-ai/artifacts/phase18", { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(outputPath);
