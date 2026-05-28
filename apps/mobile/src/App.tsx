import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { VERIFGO_MVP_FEATURES, verifgoCopy } from "@verifgo/shared";

type TabKey = "history" | "settings" | "today" | "vehicle";

const tabs: ReadonlyArray<{ key: TabKey; label: string }> = [
  { key: "today", label: "Today" },
  { key: "history", label: "History" },
  { key: "vehicle", label: "Vehicle" },
  { key: "settings", label: "Settings" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("today");
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
          {activeTab === "settings" ? <SettingsPanel /> : null}
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
        Plate, accessory number, make, model, year, and default vehicle setup.
      </Text>
    </View>
  );
}

function SettingsPanel() {
  return (
    <View style={styles.panel}>
      <Text style={styles.panelKicker}>Preferences</Text>
      <Text style={styles.panelTitle}>Settings</Text>
      <Text style={styles.panelBody}>
        Language, reminder time, subscription state, and legal disclaimer.
      </Text>
    </View>
  );
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
    fontSize: 13,
    fontWeight: "800",
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
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "900",
  },
});
