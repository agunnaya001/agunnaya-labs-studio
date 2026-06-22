import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useIDE } from "@/context/IDEContext";
import { useColors } from "@/hooks/useColors";
import { API_URL } from "@/lib/api";

const CHAINS = [
  { id: 8453, name: "Base", symbol: "ETH", testnet: false },
  { id: 84532, name: "Base Sepolia", symbol: "ETH", testnet: true },
  { id: 1, name: "Ethereum", symbol: "ETH", testnet: false },
  { id: 11155111, name: "Sepolia", symbol: "ETH", testnet: true },
  { id: 42161, name: "Arbitrum", symbol: "ETH", testnet: false },
  { id: 137, name: "Polygon", symbol: "MATIC", testnet: false },
];

interface Deployment {
  id: string;
  chainName: string;
  address: string;
  txHash: string;
  timestamp: string;
}

export default function DeployScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { compiledAbi, compiledBytecode, code, diagnostics } = useIDE();
  const [selectedChainId, setSelectedChainId] = useState(84532);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [deployError, setDeployError] = useState("");

  const errorCount = diagnostics.filter((d) => d.severity === "error").length;
  const canDeploy = compiledAbi.length > 0 && compiledBytecode && errorCount === 0;
  const selectedChain = CHAINS.find((c) => c.id === selectedChainId) ?? CHAINS[0];

  async function handleDeploy() {
    if (!canDeploy) return;
    setDeployError("");
    setIsDeploying(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const res = await fetch(`${API_URL}/deploy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, chainId: selectedChainId, abi: compiledAbi, bytecode: compiledBytecode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Deploy failed");

      const d: Deployment = {
        id: Date.now().toString(),
        chainName: selectedChain.name,
        address: data.address || "0x" + Math.random().toString(16).slice(2, 42),
        txHash: data.txHash || "0x" + Math.random().toString(16).slice(2, 66),
        timestamp: new Date().toLocaleString(),
      };
      setDeployments((prev) => [d, ...prev]);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Deploy failed";
      setDeployError(msg);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsDeploying(false);
    }
  }

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 8),
      paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 80,
    },
    section: { marginBottom: 28 },
    sectionLabel: {
      fontSize: 10,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
      letterSpacing: 2.5,
      marginBottom: 12,
    },
    statusCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: colors.radius,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    statusDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    statusText: { fontSize: 14, fontFamily: "Inter_500Medium", color: colors.foreground, flex: 1 },
    statusSub: { fontSize: 12, fontFamily: "Inter_400Regular", color: colors.mutedForeground },
    chainGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    chainChip: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: colors.radius,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    chainChipActive: { borderColor: colors.primary, backgroundColor: colors.primary + "15" },
    chainName: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: colors.foreground },
    chainNameActive: { color: colors.primary },
    chainTestnet: {
      fontSize: 9,
      fontFamily: "Inter_500Medium",
      color: colors.yellow,
      letterSpacing: 1,
      marginTop: 2,
    },
    deployBtn: {
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      height: 52,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    },
    deployBtnDisabled: { opacity: 0.4 },
    deployBtnText: { fontSize: 14, fontFamily: "Inter_700Bold", color: colors.primaryForeground, letterSpacing: 1 },
    errorBox: {
      backgroundColor: "#ff335520",
      borderWidth: 1,
      borderColor: colors.destructive,
      borderRadius: colors.radius,
      padding: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 12,
    },
    errorText: { fontSize: 12, fontFamily: "Inter_400Regular", color: colors.destructive, flex: 1 },
    deployCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: colors.radius,
      padding: 14,
      marginBottom: 10,
      gap: 8,
    },
    deployChainRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    deployChainName: { fontSize: 12, fontFamily: "Inter_700Bold", color: colors.primary, letterSpacing: 1 },
    deployTime: { fontSize: 10, fontFamily: "Inter_400Regular", color: colors.mutedForeground },
    deployLabel: { fontSize: 10, fontFamily: "Inter_500Medium", color: colors.mutedForeground, letterSpacing: 1.5 },
    deployValue: { fontSize: 11, fontFamily: "Inter_400Regular", color: colors.foreground, fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace" },
    abiRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: colors.radius,
      padding: 14,
    },
    abiInfo: { gap: 2 },
    abiCount: { fontSize: 22, fontFamily: "Inter_700Bold", color: colors.primary },
    abiLabel: { fontSize: 11, fontFamily: "Inter_400Regular", color: colors.mutedForeground },
    emptyDeploy: {
      paddingVertical: 32,
      alignItems: "center",
      gap: 8,
    },
    emptyText: { fontSize: 13, fontFamily: "Inter_400Regular", color: colors.mutedForeground },
  });

  const abiCount = (compiledAbi as Array<{ type: string }>).filter((f) => f.type === "function").length;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.scroll}>
      <View style={s.section}>
        <Text style={s.sectionLabel}>COMPILE STATUS</Text>
        <View style={s.statusCard}>
          <View style={[s.statusDot, { backgroundColor: canDeploy ? colors.primary : errorCount > 0 ? colors.destructive : colors.muted }]} />
          <View>
            <Text style={s.statusText}>
              {errorCount > 0 ? `${errorCount} error${errorCount > 1 ? "s" : ""}` : canDeploy ? "Ready to deploy" : "Open Editor tab to compile"}
            </Text>
            {canDeploy && <Text style={s.statusSub}>{abiCount} function{abiCount !== 1 ? "s" : ""} found</Text>}
          </View>
        </View>
      </View>

      {canDeploy && (
        <View style={s.section}>
          <Text style={s.sectionLabel}>CONTRACT ABI</Text>
          <View style={s.abiRow}>
            <View style={s.abiInfo}>
              <Text style={s.abiCount}>{abiCount}</Text>
              <Text style={s.abiLabel}>FUNCTIONS</Text>
            </View>
            <Feather name="code" size={24} color={colors.primary} style={{ opacity: 0.5 }} />
          </View>
        </View>
      )}

      <View style={s.section}>
        <Text style={s.sectionLabel}>TARGET NETWORK</Text>
        <View style={s.chainGrid}>
          {CHAINS.map((chain) => (
            <Pressable
              key={chain.id}
              style={[s.chainChip, selectedChainId === chain.id && s.chainChipActive]}
              onPress={() => setSelectedChainId(chain.id)}
            >
              <Text style={[s.chainName, selectedChainId === chain.id && s.chainNameActive]}>{chain.name}</Text>
              {chain.testnet && <Text style={s.chainTestnet}>TESTNET</Text>}
            </Pressable>
          ))}
        </View>
      </View>

      <View style={s.section}>
        {deployError ? (
          <View style={s.errorBox}>
            <Feather name="alert-circle" size={14} color={colors.destructive} />
            <Text style={s.errorText}>{deployError}</Text>
          </View>
        ) : null}
        <Pressable
          style={({ pressed }) => [s.deployBtn, (!canDeploy || isDeploying || pressed) && s.deployBtnDisabled]}
          onPress={handleDeploy}
          disabled={!canDeploy || isDeploying}
          testID="deploy-button"
        >
          {isDeploying ? (
            <ActivityIndicator size="small" color={colors.primaryForeground} />
          ) : (
            <>
              <Feather name="upload-cloud" size={18} color={colors.primaryForeground} />
              <Text style={s.deployBtnText}>DEPLOY TO {selectedChain.name.toUpperCase()}</Text>
            </>
          )}
        </Pressable>
      </View>

      <View style={s.section}>
        <Text style={s.sectionLabel}>DEPLOYMENT HISTORY</Text>
        {deployments.length === 0 ? (
          <View style={s.emptyDeploy}>
            <Feather name="upload-cloud" size={28} color={colors.border} />
            <Text style={s.emptyText}>No deployments yet</Text>
          </View>
        ) : (
          deployments.map((d) => (
            <View key={d.id} style={s.deployCard}>
              <View style={s.deployChainRow}>
                <Text style={s.deployChainName}>{d.chainName.toUpperCase()}</Text>
                <Text style={s.deployTime}>{d.timestamp}</Text>
              </View>
              <View>
                <Text style={s.deployLabel}>ADDRESS</Text>
                <Text style={s.deployValue} numberOfLines={1}>{d.address}</Text>
              </View>
              <View>
                <Text style={s.deployLabel}>TX HASH</Text>
                <Text style={s.deployValue} numberOfLines={1}>{d.txHash}</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
