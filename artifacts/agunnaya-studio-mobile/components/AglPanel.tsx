import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColors";

interface AglStatus {
  wallet: string | null;
  onChainBalance: number;
  tier: "free" | "pro" | "enterprise";
  credits: number;
  subscriptionExpiresAt: string | null;
  treasury: string | null;
}

const AGL_TOKEN = "0xEA1221B4d80A89BD8C75248Fae7c176BD1854698";
const TIER_COLORS = { free: "#9ca3af", pro: "#00ff41", enterprise: "#facc15" };

interface Props {
  status: AglStatus | null;
  loading: boolean;
  onConnectWallet: (address: string) => Promise<void>;
  onTopUp: (txHash: string) => Promise<{ creditsAdded: number }>;
  onSubscribe: (txHash: string) => Promise<{ subscriptionExpiresAt: string }>;
}

export function AglPanel({ status, loading, onConnectWallet, onTopUp, onSubscribe }: Props) {
  const colors = useColors();
  const [walletInput, setWalletInput] = useState("");
  const [txHash, setTxHash] = useState("");
  const [subHash, setSubHash] = useState("");
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [working, setWorking] = useState(false);

  const s = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: colors.radius,
      padding: 16,
      gap: 14,
    },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    label: { fontSize: 10, fontFamily: "Inter_600SemiBold", color: colors.primary, letterSpacing: 2 },
    tierBadge: { fontSize: 10, fontFamily: "Inter_700Bold", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
    statLabel: { fontSize: 12, fontFamily: "Inter_400Regular", color: colors.mutedForeground },
    statValue: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: colors.foreground },
    input: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 11,
      fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
      color: colors.foreground,
    },
    btn: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingVertical: 10,
      alignItems: "center",
    },
    btnOutline: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 8,
      paddingVertical: 10,
      alignItems: "center",
    },
    btnText: { fontSize: 12, fontFamily: "Inter_700Bold", color: colors.primaryForeground, letterSpacing: 1 },
    btnOutlineText: { fontSize: 12, fontFamily: "Inter_700Bold", color: colors.primary, letterSpacing: 1 },
    divider: { height: 1, backgroundColor: colors.border },
    hint: { fontSize: 11, fontFamily: "Inter_400Regular", color: colors.mutedForeground, lineHeight: 16 },
    msgOk: { fontSize: 11, fontFamily: "Inter_500Medium", color: colors.primary },
    msgErr: { fontSize: 11, fontFamily: "Inter_500Medium", color: "#f87171" },
  });

  if (loading) {
    return (
      <View style={s.card}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  const tier = status?.tier ?? "free";
  const tierColor = TIER_COLORS[tier];

  async function handleConnect() {
    const addr = walletInput.trim();
    if (!/^0x[0-9a-fA-F]{40}$/.test(addr)) {
      setMsg({ text: "Invalid address format", ok: false });
      return;
    }
    setWorking(true); setMsg(null);
    try { await onConnectWallet(addr); setWalletInput(""); }
    catch (e) { setMsg({ text: (e as Error).message, ok: false }); }
    finally { setWorking(false); }
  }

  async function handleTopUp() {
    if (!txHash.trim()) return;
    setWorking(true); setMsg(null);
    try {
      const { creditsAdded } = await onTopUp(txHash.trim());
      setMsg({ text: `+${creditsAdded} credits added!`, ok: true });
      setTxHash("");
    } catch (e) { setMsg({ text: (e as Error).message, ok: false }); }
    finally { setWorking(false); }
  }

  async function handleSubscribe() {
    if (!subHash.trim()) return;
    setWorking(true); setMsg(null);
    try {
      const { subscriptionExpiresAt } = await onSubscribe(subHash.trim());
      const d = new Date(subscriptionExpiresAt).toLocaleDateString();
      setMsg({ text: `PRO active until ${d}`, ok: true });
      setSubHash("");
    } catch (e) { setMsg({ text: (e as Error).message, ok: false }); }
    finally { setWorking(false); }
  }

  return (
    <View style={s.card}>
      <View style={s.row}>
        <Text style={s.label}>AGL TOKEN</Text>
        <View style={{ backgroundColor: tierColor + "22", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 }}>
          <Text style={[s.tierBadge, { color: tierColor }]}>{tier.toUpperCase()}</Text>
        </View>
      </View>

      {!status?.wallet ? (
        <View style={{ gap: 8 }}>
          <Text style={s.hint}>Enter your wallet address to check your AGL balance and unlock Pro features.</Text>
          <TextInput
            style={s.input}
            value={walletInput}
            onChangeText={setWalletInput}
            placeholder="0x…"
            placeholderTextColor={colors.mutedForeground}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {msg && <Text style={msg.ok ? s.msgOk : s.msgErr}>{msg.text}</Text>}
          <Pressable style={({ pressed }) => [s.btn, pressed && { opacity: 0.8 }]} onPress={handleConnect} disabled={working}>
            {working ? <ActivityIndicator size="small" color={colors.primaryForeground} />
              : <Text style={s.btnText}>CONNECT WALLET</Text>}
          </Pressable>
        </View>
      ) : (
        <View style={{ gap: 8 }}>
          <View style={s.row}>
            <Text style={s.statLabel}>Wallet</Text>
            <Text style={[s.statValue, { fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace", fontSize: 11 }]}>
              {status.wallet.slice(0, 6)}…{status.wallet.slice(-4)}
            </Text>
          </View>
          <View style={s.row}>
            <Text style={s.statLabel}>AGL Balance</Text>
            <Text style={[s.statValue, { color: colors.primary }]}>{status.onChainBalance.toLocaleString()} AGL</Text>
          </View>
          <View style={s.row}>
            <Text style={s.statLabel}>Credits</Text>
            <Text style={[s.statValue, { color: status.credits < 10 ? "#f87171" : colors.primary }]}>{status.credits}</Text>
          </View>
          {status.subscriptionExpiresAt && new Date(status.subscriptionExpiresAt) > new Date() && (
            <View style={s.row}>
              <Text style={s.statLabel}>Subscription</Text>
              <Text style={[s.statValue, { color: colors.primary }]}>
                until {new Date(status.subscriptionExpiresAt).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      )}

      {status?.wallet && tier === "free" && (
        <>
          <View style={s.divider} />
          <View style={{ gap: 8 }}>
            <Text style={[s.label, { letterSpacing: 1 }]}>BUY CREDITS (1 AGL = 100 credits)</Text>
            {status.treasury && (
              <Text style={[s.hint, { fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace", fontSize: 10 }]}>
                Treasury: {status.treasury.slice(0, 10)}…{status.treasury.slice(-6)}
              </Text>
            )}
            <TextInput
              style={s.input}
              value={txHash}
              onChangeText={setTxHash}
              placeholder="Tx hash after AGL transfer…"
              placeholderTextColor={colors.mutedForeground}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable style={({ pressed }) => [s.btnOutline, pressed && { opacity: 0.7 }]} onPress={handleTopUp} disabled={working || !txHash.trim()}>
              {working ? <ActivityIndicator size="small" color={colors.primary} />
                : <Text style={s.btnOutlineText}>CLAIM CREDITS</Text>}
            </Pressable>
          </View>

          <View style={s.divider} />
          <View style={{ gap: 8 }}>
            <Text style={[s.label, { letterSpacing: 1 }]}>SUBSCRIBE — 50 AGL / 30 DAYS</Text>
            <TextInput
              style={s.input}
              value={subHash}
              onChangeText={setSubHash}
              placeholder="Tx hash after sending 50 AGL…"
              placeholderTextColor={colors.mutedForeground}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable style={({ pressed }) => [s.btn, pressed && { opacity: 0.8 }]} onPress={handleSubscribe} disabled={working || !subHash.trim()}>
              {working ? <ActivityIndicator size="small" color={colors.primaryForeground} />
                : <Text style={s.btnText}>ACTIVATE PRO</Text>}
            </Pressable>
          </View>
        </>
      )}

      {msg && <Text style={msg.ok ? s.msgOk : s.msgErr}>{msg.text}</Text>}

      <View style={s.divider} />
      <Pressable onPress={() => Linking.openURL(`https://basescan.org/token/${AGL_TOKEN}`)}>
        <Text style={s.hint}>
          <Feather name="external-link" size={11} color={colors.mutedForeground} /> View AGL on BaseScan
        </Text>
      </Pressable>
    </View>
  );
}
