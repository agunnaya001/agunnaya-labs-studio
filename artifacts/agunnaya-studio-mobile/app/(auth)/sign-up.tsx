import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function SignUpScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  async function handleSignUp() {
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError("");
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const result = await signUp(email.trim().toLowerCase(), password, name.trim());
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.replace("/(tabs)/editor");
    }
  }

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: 28,
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0),
      paddingBottom: insets.bottom + 24,
    },
    header: { marginBottom: 40 },
    logo: { fontSize: 13, fontFamily: "Inter_500Medium", color: colors.primary, letterSpacing: 3, marginBottom: 12 },
    title: { fontSize: 32, fontFamily: "Inter_700Bold", color: colors.foreground, letterSpacing: -0.5 },
    subtitle: { fontSize: 15, fontFamily: "Inter_400Regular", color: colors.mutedForeground, marginTop: 8 },
    form: { gap: 16 },
    label: { fontSize: 11, fontFamily: "Inter_500Medium", color: colors.primary, letterSpacing: 2, marginBottom: 6 },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: colors.radius,
      paddingHorizontal: 14,
      height: 52,
    },
    inputWrapperFocused: { borderColor: colors.primary },
    input: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular", color: colors.foreground, paddingVertical: 0 },
    errorBox: {
      backgroundColor: "#ff335520",
      borderWidth: 1,
      borderColor: colors.destructive,
      borderRadius: colors.radius,
      padding: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    errorText: { fontSize: 13, fontFamily: "Inter_400Regular", color: colors.destructive, flex: 1 },
    button: {
      backgroundColor: colors.primary,
      borderRadius: colors.radius,
      height: 52,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { fontSize: 15, fontFamily: "Inter_700Bold", color: colors.primaryForeground, letterSpacing: 0.5 },
    footer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 32, gap: 4 },
    footerText: { fontSize: 14, fontFamily: "Inter_400Regular", color: colors.mutedForeground },
    link: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: colors.primary },
    scanline: { position: "absolute", top: 0, left: 0, right: 0, height: 2, backgroundColor: colors.primary, opacity: 0.4 },
  });

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={s.scanline} />
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.header}>
          <Text style={s.logo}>AGUNNAYA AI STUDIO</Text>
          <Text style={s.title}>Create account</Text>
          <Text style={s.subtitle}>Start building smart contracts with AI</Text>
        </View>

        <View style={s.form}>
          <View>
            <Text style={s.label}>NAME</Text>
            <View style={[s.inputWrapper, nameFocused && s.inputWrapperFocused]}>
              <Feather name="user" size={16} color={nameFocused ? colors.primary : colors.muted} style={{ marginRight: 10 }} />
              <TextInput
                style={s.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={colors.muted}
                returnKeyType="next"
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                onSubmitEditing={() => emailRef.current?.focus()}
              />
            </View>
          </View>

          <View>
            <Text style={s.label}>EMAIL</Text>
            <View style={[s.inputWrapper, emailFocused && s.inputWrapperFocused]}>
              <Feather name="mail" size={16} color={emailFocused ? colors.primary : colors.muted} style={{ marginRight: 10 }} />
              <TextInput
                ref={emailRef}
                style={s.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={colors.muted}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
            </View>
          </View>

          <View>
            <Text style={s.label}>PASSWORD</Text>
            <View style={[s.inputWrapper, passwordFocused && s.inputWrapperFocused]}>
              <Feather name="lock" size={16} color={passwordFocused ? colors.primary : colors.muted} style={{ marginRight: 10 }} />
              <TextInput
                ref={passwordRef}
                style={s.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Min. 8 characters"
                placeholderTextColor={colors.muted}
                secureTextEntry
                returnKeyType="done"
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                onSubmitEditing={handleSignUp}
              />
            </View>
          </View>

          {error ? (
            <View style={s.errorBox}>
              <Feather name="alert-circle" size={14} color={colors.destructive} />
              <Text style={s.errorText}>{error}</Text>
            </View>
          ) : null}

          <Pressable
            style={({ pressed }) => [s.button, (loading || pressed) && s.buttonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.primaryForeground} />
            ) : (
              <Text style={s.buttonText}>CREATE ACCOUNT</Text>
            )}
          </Pressable>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>Already have an account?</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={s.link}>Sign in</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
