import { Feather } from "@expo/vector-icons";
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

import { useColors } from "@/hooks/useColors";

const FEATURES = [
  {
    icon: "code" as const,
    title: "Solidity Editor",
    desc: "Write and compile smart contracts with real-time diagnostics.",
  },
  {
    icon: "cpu" as const,
    title: "8 AI Agents",
    desc: "Architect, Auditor, Gas Optimizer, Deployer and more — each specialized.",
  },
  {
    icon: "shield" as const,
    title: "Security Audits",
    desc: "Detect reentrancy, access control flaws, and other vulnerabilities.",
  },
  {
    icon: "upload-cloud" as const,
    title: "Multi-Chain Deploy",
    desc: "Deploy to Base, Ethereum, Arbitrum, Optimism, and Polygon.",
  },
  {
    icon: "zap" as const,
    title: "Gas Optimization",
    desc: "Reduce on-chain costs with AI-powered analysis.",
  },
  {
    icon: "file-text" as const,
    title: "NatSpec Docs",
    desc: "Auto-generate documentation for every function and event.",
  },
];

export default function LandingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: {
      paddingHorizontal: 24,
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 20),
      paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 32,
    },
    hero: { marginBottom: 48, alignItems: "center" },
    badge: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
      letterSpacing: 3,
      marginBottom: 20,
    },
    terminal: {
      width: 72,
      height: 72,
      borderRadius: 18,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.primary + "44",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
    },
    title: {
      fontSize: 36,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      textAlign: "center",
      lineHeight: 42,
      letterSpacing: -0.5,
      marginBottom: 14,
    },
    accent: { color: colors.primary },
    subtitle: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 22,
      maxWidth: 320,
    },
    grid: { marginBottom: 40, gap: 12 },
    featureCard: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 14,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: colors.radius,
      padding: 14,
    },
    iconWrap: {
      width: 36,
      height: 36,
      borderRadius: 8,
      backgroundColor: colors.primary + "18",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    featureTitle: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 2,
    },
    featureDesc: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 17,
    },
    cta: {
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      height: 52,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 14,
    },
    ctaText: {
      fontSize: 15,
      fontFamily: "Inter_700Bold",
      color: colors.primaryForeground,
      letterSpacing: 1,
    },
    secondaryBtn: {
      height: 48,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: colors.radius,
    },
    secondaryText: {
      fontSize: 14,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    scanline: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: colors.primary,
      opacity: 0.35,
    },
  });

  return (
    <View style={s.container}>
      <View style={s.scanline} />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={s.hero}>
          <Text style={s.badge}>AGUNNAYA AI STUDIO</Text>
          <View style={s.terminal}>
            <Feather name="terminal" size={30} color={colors.primary} />
          </View>
          <Text style={s.title}>
            Build <Text style={s.accent}>smarter</Text>{"\n"}smart contracts
          </Text>
          <Text style={s.subtitle}>
            AI-powered Solidity IDE with 8 specialized agents. Write, audit, and deploy on Base and EVM chains.
          </Text>
        </View>

        <View style={s.grid}>
          {FEATURES.map((f) => (
            <View key={f.icon} style={s.featureCard}>
              <View style={s.iconWrap}>
                <Feather name={f.icon} size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.featureTitle}>{f.title}</Text>
                <Text style={s.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [s.cta, pressed && { opacity: 0.85 }]}
          onPress={() => router.push("/(auth)/sign-up")}
          testID="get-started-button"
        >
          <Text style={s.ctaText}>GET STARTED</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [s.secondaryBtn, pressed && { opacity: 0.7 }]}
          onPress={() => router.push("/(auth)/sign-in")}
          testID="sign-in-link"
        >
          <Text style={s.secondaryText}>Already have an account? Sign in</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
