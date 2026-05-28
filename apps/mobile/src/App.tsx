import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  VERIFGO_MVP_FEATURES,
  VERIFGO_PREMIUM_SMART_REMINDERS,
  verifgoCopy,
} from "@verifgo/shared";

type TabKey = "history" | "settings" | "today" | "vehicle";

const tabs: ReadonlyArray<{ key: TabKey; label: string }> = [
  { key: "today", label: "Today" },
  { key: "history", label: "History" },
  { key: "vehicle", label: "Vehicle" },
  { key: "settings", label: "Settings" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("today");
  const [smartRemindersEnabled, setSmartRemindersEnabled] = useState(false);
  const copy = verifgoCopy.en;
  const completion = useMemo(
    () => `${VERIFGO_MVP_FEATURES.length} MVP features locked`,
    [],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>VERIFGO QC</Text>
          <Text style={styles.title}>Daily readiness</Text>
          <Text style={styles.subtitle}>{copy.todayReady}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {activeTab === "today" ? <TodayPanel completion={completion} /> : null}
          {activeTab === "history" ? <HistoryPanel /> : null}
          {activeTab === "vehicle" ? <VehiclePanel /> : null}
          {activeTab === "settings" ? (
            <SettingsPanel
              enabled={smartRemindersEnabled}
              onToggle={() => setSmartRemindersEnabled((value) => !value)}
            />
          ) : null}
        </ScrollView>

        <View style={styles.tabbar}>
          {tabs.map((tab) => (
            <TouchableOpacity
              accessibilityRole="button"
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.tab,
                activeTab === tab.key ? styles.tabActive : null,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key ? styles.tabTextActive : null,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

function TodayPanel({ completion }: Readonly<{ completion: string }>) {
  return (
    <View style={styles.panel}>
      <Text style={styles.panelKicker}>Before first ride</Text>
      <Text style={styles.panelTitle}>Complete today&apos;s verification</Text>
      <Text style={styles.panelBody}>
        Start the 30-second check, confirm required items, and make inspector
        mode ready for today.
      </Text>
      <TouchableOpacity accessibilityRole="button" style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Start verification</Text>
      </TouchableOpacity>
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Status</Text>
        <Text style={styles.statusValue}>Not submitted</Text>
      </View>
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Scope</Text>
        <Text style={styles.statusValue}>{completion}</Text>
      </View>
    </View>
  );
}

function HistoryPanel() {
  return (
    <View style={styles.panel}>
      <Text style={styles.panelKicker}>Proof trail</Text>
      <Text style={styles.panelTitle}>History</Text>
      <Text style={styles.panelBody}>
        Submitted reports, corrections, PDF exports, and inspector events will
        appear here.
      </Text>
    </View>
  );
}

function VehiclePanel() {
  return (
    <View style={styles.panel}>
      <Text style={styles.panelKicker}>Setup</Text>
      <Text style={styles.panelTitle}>Vehicle</Text>
      <Text style={styles.panelBody}>
        Register the real vehicle used for work. Keep purpose, powertrain, and
        identity separate so reports and reminders stay accurate.
      </Text>
      <View style={styles.stack}>
        <InfoRow label="Vehicle use" value="Rideshare, taxi, delivery, personal" />
        <InfoRow label="Powertrain" value="Gas, diesel, hybrid, plug-in hybrid, EV" />
        <InfoRow label="Optional photo" value="Upload during vehicle registration" />
      </View>
    </View>
  );
}

function SettingsPanel({
  enabled,
  onToggle,
}: Readonly<{ enabled: boolean; onToggle: () => void }>) {
  const copy = verifgoCopy.en;

  return (
    <View style={styles.panel}>
      <Text style={styles.panelKicker}>Preferences</Text>
      <Text style={styles.panelTitle}>Settings</Text>
      <Text style={styles.panelBody}>
        Language, reminder time, subscription state, and legal disclaimer.
      </Text>
      <View style={styles.smartCard}>
        <View style={styles.smartHeader}>
          <View style={styles.smartTitleGroup}>
            <Text style={styles.smartTitle}>{copy.smartReminders}</Text>
            <Text style={styles.smartBody}>{copy.smartRemindersDescription}</Text>
          </View>
          <TouchableOpacity
            accessibilityRole="switch"
            accessibilityState={{ checked: enabled }}
            onPress={onToggle}
            style={[styles.switchTrack, enabled ? styles.switchTrackOn : null]}
          >
            <View
              style={[
                styles.switchThumb,
                enabled ? styles.switchThumbOn : null,
              ]}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.smartMeta}>
          {VERIFGO_PREMIUM_SMART_REMINDERS.length} Quebec seasonal reminders are
          included as one premium bundle.
        </Text>
        <View style={styles.reminderList}>
          {VERIFGO_PREMIUM_SMART_REMINDERS.map((reminder) => (
            <Text key={reminder.code} style={styles.reminderItem}>
              {formatReminderCode(reminder.code)}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

function InfoRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <View style={styles.statusRow}>
      <Text style={styles.statusLabel}>{label}</Text>
      <Text style={styles.statusValue}>{value}</Text>
    </View>
  );
}

function formatReminderCode(code: string) {
  return code
    .split("_")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

const colors = {
  bg: "#071016",
  border: "rgba(255,255,255,0.1)",
  muted: "rgba(245,247,250,0.68)",
  primary: "#14b8a6",
  primaryDark: "#042f2e",
  surface: "#101b24",
  surfaceMuted: "#0d1820",
  text: "#f5f7fa",
};

const styles = StyleSheet.create({
  content: {
    gap: 14,
    padding: 16,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2.5,
  },
  header: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    gap: 6,
    padding: 18,
  },
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    padding: 18,
  },
  panelBody: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  panelKicker: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  panelTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 14,
    minHeight: 52,
    justifyContent: "center",
  },
  primaryButtonText: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: "900",
  },
  safe: {
    backgroundColor: colors.bg,
    flex: 1,
  },
  shell: {
    backgroundColor: colors.bg,
    flex: 1,
  },
  smartBody: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  smartCard: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    padding: 14,
  },
  smartHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    justifyContent: "space-between",
  },
  smartMeta: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
  },
  smartTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  smartTitleGroup: {
    flex: 1,
    gap: 4,
  },
  stack: {
    gap: 10,
  },
  statusLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
  },
  statusRow: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  statusValue: {
    color: colors.text,
    flexShrink: 1,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "right",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
  },
  tab: {
    alignItems: "center",
    borderRadius: 12,
    flex: 1,
    minHeight: 44,
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: "rgba(20,184,166,0.14)",
  },
  tabText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
  },
  tabTextActive: {
    color: colors.primary,
  },
  tabbar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 8,
    padding: 10,
  },
  reminderItem: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
  },
  reminderList: {
    gap: 8,
  },
  switchThumb: {
    backgroundColor: colors.muted,
    borderRadius: 11,
    height: 22,
    width: 22,
  },
  switchThumbOn: {
    alignSelf: "flex-end",
    backgroundColor: colors.primaryDark,
  },
  switchTrack: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: "center",
    padding: 3,
    width: 58,
  },
  switchTrackOn: {
    backgroundColor: colors.primary,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "900",
  },
});
