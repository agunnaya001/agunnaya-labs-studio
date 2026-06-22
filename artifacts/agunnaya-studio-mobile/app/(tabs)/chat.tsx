import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { fetch } from "expo/fetch";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AGENTS, useIDE } from "@/context/IDEContext";
import { useColors } from "@/hooks/useColors";
import { API_URL } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

let msgCounter = 0;
function uid() {
  msgCounter++;
  return `m-${Date.now()}-${msgCounter}-${Math.random().toString(36).substr(2, 6)}`;
}

export default function ChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { selectedAgentId, setSelectedAgentId, code } = useIDE();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const currentAgent = AGENTS.find((a) => a.id === selectedAgentId) ?? AGENTS[0];

  async function handleSend() {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const currentMessages = [...messages];
    const userMsg: Message = { id: uid(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);
    setShowTyping(true);

    try {
      const chatHistory = [
        ...currentMessages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: text },
      ];

      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
        body: JSON.stringify({ agentId: selectedAgentId, messages: chatHistory, contractCode: code }),
      });

      if (!res.ok) throw new Error("Request failed");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No body");

      const decoder = new TextDecoder();
      let fullContent = "";
      let buffer = "";
      let assistantAdded = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              fullContent += parsed.content;
              if (!assistantAdded) {
                setShowTyping(false);
                setMessages((prev) => [...prev, { id: uid(), role: "assistant", content: fullContent }]);
                assistantAdded = true;
              } else {
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { ...updated[updated.length - 1], content: fullContent };
                  return updated;
                });
              }
            }
          } catch {}
        }
      }
    } catch {
      setShowTyping(false);
      setMessages((prev) => [...prev, { id: uid(), role: "assistant", content: "Connection error. Check your network and API config." }]);
    } finally {
      setIsStreaming(false);
      setShowTyping(false);
      inputRef.current?.focus();
    }
  }

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    agentBar: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 8),
    },
    agentBarLabel: {
      fontSize: 10,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
      letterSpacing: 2,
      paddingHorizontal: 16,
      paddingBottom: 8,
    },
    agentScroll: { paddingHorizontal: 12, paddingBottom: 10, gap: 8 },
    agentChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      marginRight: 8,
    },
    agentChipActive: { borderColor: colors.primary, backgroundColor: colors.primary + "20" },
    agentChipText: { fontSize: 12, fontFamily: "Inter_500Medium", color: colors.mutedForeground },
    agentChipTextActive: { color: colors.primary },
    list: { flex: 1, paddingHorizontal: 16 },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
      gap: 12,
    },
    emptyTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: colors.foreground },
    emptySubtitle: { fontSize: 13, fontFamily: "Inter_400Regular", color: colors.mutedForeground, textAlign: "center", paddingHorizontal: 32 },
    userBubble: {
      alignSelf: "flex-end",
      backgroundColor: colors.primary,
      borderRadius: 14,
      borderBottomRightRadius: 4,
      paddingHorizontal: 14,
      paddingVertical: 10,
      maxWidth: "80%",
      marginVertical: 4,
    },
    userText: { fontSize: 14, fontFamily: "Inter_400Regular", color: colors.primaryForeground, lineHeight: 20 },
    assistantBubble: {
      alignSelf: "flex-start",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      borderBottomLeftRadius: 4,
      paddingHorizontal: 14,
      paddingVertical: 10,
      maxWidth: "85%",
      marginVertical: 4,
    },
    assistantText: { fontSize: 14, fontFamily: "Inter_400Regular", color: colors.foreground, lineHeight: 20 },
    typingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 8,
    },
    typingDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.primary,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 10,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.bgSecondary,
      paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 10,
    },
    inputBox: {
      flex: 1,
      backgroundColor: colors.input,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      maxHeight: 100,
    },
    sendBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    sendBtnDisabled: { opacity: 0.5 },
    roleBadge: {
      fontSize: 10,
      fontFamily: "Inter_500Medium",
      color: colors.primary,
      marginBottom: 4,
      letterSpacing: 1,
    },
  });

  const reversed = [...messages].reverse();

  return (
    <KeyboardAvoidingView style={s.container} behavior="padding" keyboardVerticalOffset={0}>
      <View style={s.agentBar}>
        <Text style={s.agentBarLabel}>AI AGENT</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.agentScroll}>
          {AGENTS.map((agent) => (
            <Pressable
              key={agent.id}
              style={[s.agentChip, selectedAgentId === agent.id && s.agentChipActive]}
              onPress={() => setSelectedAgentId(agent.id)}
            >
              <Text style={[s.agentChipText, selectedAgentId === agent.id && s.agentChipTextActive]}>
                {agent.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        style={s.list}
        data={reversed}
        keyExtractor={(item) => item.id}
        inverted={messages.length > 0}
        renderItem={({ item }) => (
          item.role === "user" ? (
            <View style={s.userBubble}>
              <Text style={s.userText}>{item.content}</Text>
            </View>
          ) : (
            <View>
              <Text style={s.roleBadge}>{currentAgent.name.toUpperCase()}</Text>
              <View style={s.assistantBubble}>
                <Text style={s.assistantText}>{item.content}</Text>
              </View>
            </View>
          )
        )}
        ListHeaderComponent={showTyping ? (
          <View style={s.typingRow}>
            <View style={[s.typingDot, { opacity: 0.4 }]} />
            <View style={[s.typingDot, { opacity: 0.7 }]} />
            <View style={s.typingDot} />
          </View>
        ) : null}
        ListEmptyComponent={() => (
          <View style={s.emptyContainer}>
            <Feather name="cpu" size={32} color={colors.primary} />
            <Text style={s.emptyTitle}>{currentAgent.name}</Text>
            <Text style={s.emptySubtitle}>
              {currentAgent.role} specialist. Ask me anything about your Solidity contract.
            </Text>
          </View>
        )}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingVertical: 16, flexGrow: 1 }}
      />

      <View style={s.inputRow}>
        <TextInput
          ref={inputRef}
          style={s.inputBox}
          value={input}
          onChangeText={setInput}
          placeholder={`Ask ${currentAgent.name}...`}
          placeholderTextColor={colors.muted}
          multiline
          blurOnSubmit={false}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          testID="chat-input"
        />
        <Pressable
          style={[s.sendBtn, (isStreaming || !input.trim()) && s.sendBtnDisabled]}
          onPress={handleSend}
          disabled={isStreaming || !input.trim()}
          testID="send-button"
        >
          {isStreaming ? (
            <ActivityIndicator size="small" color={colors.primaryForeground} />
          ) : (
            <Feather name="send" size={16} color={colors.primaryForeground} />
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
