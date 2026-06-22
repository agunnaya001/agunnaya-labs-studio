import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useIDE } from "@/context/IDEContext";
import { useColors } from "@/hooks/useColors";
import { API_URL } from "@/lib/api";

export default function EditorScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { code, setCode, diagnostics, setDiagnostics, setCompiledAbi, setCompiledBytecode, isCompiling, setIsCompiling } = useIDE();
  const [compileTimeout, setCompileTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 8),
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    fileName: { fontSize: 12, fontFamily: "Inter_500Medium", color: colors.mutedForeground, letterSpacing: 1 },
    compileBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.primary,
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: colors.radius,
    },
    compileBtnDisabled: { opacity: 0.5 },
    compileBtnText: { fontSize: 12, fontFamily: "Inter_700Bold", color: colors.primaryForeground, letterSpacing: 1 },
    editorContainer: { flex: 1, position: "relative" },
    lineNumbers: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 40,
      backgroundColor: colors.bgSecondary,
      paddingTop: 12,
      alignItems: "flex-end",
      paddingRight: 8,
      zIndex: 1,
    },
    lineNum: { fontSize: 11, fontFamily: "Inter_400Regular", color: colors.textDim, lineHeight: 20, height: 20 },
    editor: {
      flex: 1,
      paddingLeft: 52,
      paddingRight: 12,
      paddingTop: 12,
      paddingBottom: 12,
      fontSize: 13,
      fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
      color: colors.primary,
      lineHeight: 20,
      textAlignVertical: "top",
      backgroundColor: colors.background,
    },
    diagnosticsPanel: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.bgSecondary,
      maxHeight: 160,
    },
    diagHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    diagTitle: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: colors.mutedForeground, letterSpacing: 1.5 },
    diagCount: {
      fontSize: 10,
      fontFamily: "Inter_700Bold",
      color: colors.primaryForeground,
      backgroundColor: colors.primary,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    diagItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + "40",
    },
    diagText: { fontSize: 12, fontFamily: "Inter_400Regular", color: colors.foreground, flex: 1, lineHeight: 18 },
    successMsg: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    successText: { fontSize: 12, fontFamily: "Inter_500Medium", color: colors.primary },
    bottomPad: { height: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 60 },
  });

  function compile(src: string) {
    if (!src.trim()) return;
    setIsCompiling(true);
    fetch(`${API_URL}/compile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: src }),
    })
      .then((r) => r.json())
      .then((data) => {
        const errors = data.errors || [];
        const warnings = data.warnings || [];
        setDiagnostics([...errors, ...warnings]);
        if (data.abi) setCompiledAbi(data.abi);
        if (data.bytecode) setCompiledBytecode(data.bytecode);
      })
      .catch(() => {})
      .finally(() => setIsCompiling(false));
  }

  function handleCodeChange(text: string) {
    setCode(text);
    if (compileTimeout) clearTimeout(compileTimeout);
    const t = setTimeout(() => compile(text), 1500);
    setCompileTimeout(t);
  }

  function handleManualCompile() {
    if (compileTimeout) clearTimeout(compileTimeout);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    compile(code);
  }

  const lines = code.split("\n");
  const errorCount = diagnostics.filter((d) => d.severity === "error").length;
  const warnCount = diagnostics.filter((d) => d.severity === "warning").length;
  const isSuccess = !isCompiling && errorCount === 0 && diagnostics.length >= 0 && code.trim().length > 0;

  return (
    <View style={s.container}>
      <View style={s.topBar}>
        <Text style={s.fileName}>CONTRACT.SOL</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {isCompiling && <ActivityIndicator size="small" color={colors.primary} />}
          <Pressable
            style={({ pressed }) => [s.compileBtn, (isCompiling || pressed) && s.compileBtnDisabled]}
            onPress={handleManualCompile}
            disabled={isCompiling}
          >
            <Feather name="play" size={12} color={colors.primaryForeground} />
            <Text style={s.compileBtnText}>COMPILE</Text>
          </Pressable>
        </View>
      </View>

      <View style={s.editorContainer}>
        <ScrollView style={{ flex: 1 }} horizontal={false}>
          <View style={{ flexDirection: "row" }}>
            <View style={s.lineNumbers}>
              {lines.map((_, i) => (
                <Text key={i} style={s.lineNum}>{i + 1}</Text>
              ))}
            </View>
            <TextInput
              style={[s.editor, { width: "100%" }]}
              value={code}
              onChangeText={handleCodeChange}
              multiline
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              scrollEnabled={false}
              blurOnSubmit={false}
              testID="code-editor"
            />
          </View>
          <View style={s.bottomPad} />
        </ScrollView>
      </View>

      <View style={s.diagnosticsPanel}>
        <View style={s.diagHeader}>
          <Feather name="terminal" size={12} color={colors.mutedForeground} />
          <Text style={s.diagTitle}>DIAGNOSTICS</Text>
          {errorCount > 0 && <Text style={[s.diagCount, { backgroundColor: colors.destructive }]}>{errorCount} ERR</Text>}
          {warnCount > 0 && <Text style={[s.diagCount, { backgroundColor: colors.yellow }]}>{warnCount} WARN</Text>}
          {isSuccess && diagnostics.length === 0 && <Text style={[s.diagCount]}>OK</Text>}
        </View>
        <ScrollView>
          {diagnostics.length === 0 && !isCompiling ? (
            <View style={s.successMsg}>
              <Feather name="check-circle" size={14} color={colors.primary} />
              <Text style={s.successText}>No issues found</Text>
            </View>
          ) : (
            diagnostics.map((d, i) => (
              <View key={i} style={s.diagItem}>
                <Feather
                  name={d.severity === "error" ? "x-circle" : d.severity === "warning" ? "alert-triangle" : "info"}
                  size={13}
                  color={d.severity === "error" ? colors.destructive : d.severity === "warning" ? colors.yellow : colors.mutedForeground}
                  style={{ marginTop: 2 }}
                />
                <Text style={s.diagText}>{d.message}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}
