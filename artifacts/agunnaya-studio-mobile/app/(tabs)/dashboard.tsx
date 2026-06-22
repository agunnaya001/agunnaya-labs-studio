import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { AGENTS, useIDE } from "@/context/IDEContext";
import { useColors } from "@/hooks/useColors";

const QUICK_ACTIONS = [
  { icon: "code" as const, label: "Editor", route: "/(tabs)/editor" as const },
  { icon: "message-circle" as const, label: "Chat", route: "/(tabs)/chat" as const },
  { icon: "upload-cloud" as const, label: "Deploy", route: "/(tabs)/deploy" as const },
];

const FEATURE_CARDS = [
  { icon: "layers" as const, title: "Smart Contracts", desc: "Develop and deploy Solidity contracts", color: "#00ff41" },
  { icon: "shield" as const, title: "Security Audit", desc: "Find vulnerabilities before going live", color: "#ffcc00" },
  { icon: "zap" as const, title: "Gas Optimizer", desc: "Reduce transaction costs", color: "#a3ff47" },
  { icon: "upload-cloud" as const, title: "Deploy to Base", desc: "One-click deployment to EVM chains", color: "#00e5ff" },
  { icon: "cpu" as const, title: "AI Agents", desc: "8 specialized Web3 AI experts", color: "#ff79c6" },
  { icon: "file-text" as const, title: "Documentation", desc: "Auto-generate NatSpec docs", color: "#bd93f9" },
];

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const { setSelectedAgentId } = useIDE();

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: {
      paddingHorizontal: 16,
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 12),
      paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 80,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 28,
    },
    greeting: { gap: 2 },
    greetingLabel: { fontSize: 12, fontFamily: "Inter_400Regular", color: colors.mutedForeground },
    greetingName: { fontSize: 22, fontFamily: "Inter_700Bold", color: colors.foreground },
    logoutBtn: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    sectionLabel: {
      fontSize: 10,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
      letterSpacing: 2.5,
      marginBottom: 12,
    },
    quickRow: { flexDirection: "row", gap: 10, marginBottom: 32 },
    quickBtn: {
      flex: 1,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: colors.radius,
      paddingVertical: 16,
      alignItems: "center",
      gap: 8,
    },
    quickBtnLabel: { fontSize: 11, fontFamily: "Inter_500Medium", color: colors.foreground },
    agentRow: { marginBottom: 32 },
    agentScroll: { gap: 10 },
    agentCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: colors.radius,
      padding: 14,
      width: 140,
      gap: 6,
    },
    agentRole: { fontSize: 9, fontFamily: "Inter_600SemiBold", color: colors.primary, letterSpacing: 1.5 },
    agentName: { fontSize: 14, fontFamily: "Inter_700Bold", color: colors.foreground },
    agentDesc: { fontSize: 11, fontFamily: "Inter_400Regular", color: colors.mutedForeground, lineHeight: 15 },
    featureGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 32 },
    featureCard: {
      width: "48%",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: colors.radius,
      padding: 14,
      gap: 8,
    },
    featureIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    featureTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: colors.foreground },
    featureDesc: { fontSize: 11, fontFamily: "Inter_400Regular", color: colors.mutedForeground, lineHeight: 15 },
    terminalCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: colors.radius,
      padding: 16,
      marginBottom: 12,
    },
    terminalDots: { flexDirection: "row", gap: 6, marginBottom: 12 },
    dot: { width: 10, height: 10, borderRadius: 5 },
    terminalLine: { fontSize: 12, fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace", color: colors.primary, lineHeight: 20 },
    terminalDim: { color: colors.textDim },
  });

  async function handleSignOut() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await signOut();
    router.replace("/landing");
  }

  const firstName = user?.name?.split(" ")[0] ?? "Developer";

  return (
    <ScrollView style={s.container} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <View style={s.greeting}>
          <Text style={s.greetingLabel}>Welcome back</Text>
          <Text style={s.greetingName}>{firstName}</Text>
        </View>
        <Pressable style={s.logoutBtn} onPress={handleSignOut} testID="sign-out-button">
          <Feather name="log-out" size={16} color={colors.mutedForeground} />
        </Pressable>
      </View>

      <View style={s.terminalCard}>
        <View style={s.terminalDots}>
          <View style={[s.dot, { backgroundColor: "#ff5f57" }]} />
          <View style={[s.dot, { backgroundColor: "#ffbd2e" }]} />
          <View style={[s.dot, { backgroundColor: "#28ca41" }]} />
        </View>
        <Text style={s.terminalLine}>{">"} agunnaya-ai-studio <Text style={s.terminalDim}>v1.0.0</Text></Text>
        <Text style={s.terminalLine}><Text style={s.terminalDim}>// </Text>AI-powered Solidity IDE</Text>
        <Text style={s.terminalLine}><Text style={s.terminalDim}>// </Text>8 agents · multi-chain deploy · gas optimization</Text>
        <Text style={s.terminalLine}>{">"} <Text style={{ opacity: 0.6 }}>_</Text></Text>
      </View>

      <Text style={s.sectionLabel}>QUICK ACTIONS</Text>
      <View style={s.quickRow}>
        {QUICK_ACTIONS.map((a) => (
          <Pressable
            key={a.label}
            style={({ pressed }) => [s.quickBtn, pressed && { opacity: 0.7 }]}
            onPress={() => router.push(a.route)}
          >
            <Feather name={a.icon} size={22} color={colors.primary} />
            <Text style={s.quickBtnLabel}>{a.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={s.sectionLabel}>AI AGENTS</Text>
      <View style={s.agentRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.agentScroll}>
          {AGENTS.map((agent) => (
            <Pressable
              key={agent.id}
              style={({ pressed }) => [s.agentCard, pressed && { opacity: 0.7, borderColor: colors.primary }]}
              onPress={() => {
                setSelectedAgentId(agent.id);
                router.push("/(tabs)/chat");
              }}
            >
              <Text style={s.agentRole}>{agent.role.toUpperCase()}</Text>
              <Text style={s.agentName}>{agent.name}</Text>
              <Feather name={agent.icon} size={20} color={colors.primary} style={{ opacity: 0.7 }} />
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <Text style={s.sectionLabel}>FEATURES</Text>
      <View style={s.featureGrid}>
        {FEATURE_CARDS.map((f) => (
          <View key={f.title} style={s.featureCard}>
            <View style={[s.featureIcon, { backgroundColor: f.color + "22" }]}>
              <Feather name={f.icon} size={16} color={f.color} />
            </View>
            <Text style={s.featureTitle}>{f.title}</Text>
            <Text style={s.featureDesc}>{f.desc}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
