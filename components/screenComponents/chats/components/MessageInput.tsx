import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, TextInput, TouchableOpacity, View } from "react-native";

interface MessageInputProps {
  onSend: (text: string) => Promise<void>;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    const trimmedText = text.trim();
    if (!trimmedText || isSending || disabled) return;

    setIsSending(true);
    try {
      await onSend(trimmedText);
      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const canSend = text.trim().length > 0 && !isSending && !disabled;

  return (
    <View className="bg-c2 border-t border-c3/30 px-4 py-3">
      <View className="flex-row items-end">
        {/* Text Input */}
        <View className="flex-1 bg-white rounded-3xl px-4 py-2 mr-2 border border-c3/30">
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor="#9ca3af"
            multiline
            maxLength={1000}
            style={{
              maxHeight: 100,
              fontSize: 16,
              color: "#1f2937",
            }}
            editable={!disabled && !isSending}
            className="text-base"
          />
        </View>

        {/* Send Button */}
        <TouchableOpacity
          onPress={handleSend}
          disabled={!canSend}
          className={`w-12 h-12 rounded-full items-center justify-center ${
            canSend ? "bg-c4" : "bg-gray-300"
          }`}
          activeOpacity={0.7}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Ionicons
              name="send"
              size={20}
              color={canSend ? "#ffffff" : "#9ca3af"}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
