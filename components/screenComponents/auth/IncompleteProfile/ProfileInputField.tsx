import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";

interface ProfileInputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: keyof typeof Ionicons.glyphMap;
  keyboardType?: "default" | "email-address" | "phone-pad";
  error?: string;
}

export default function ProfileInputField({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  keyboardType = "default",
  error,
}: ProfileInputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="w-full mb-5">
      <Text className={`text-sm font-semibold mb-2 ${error ? "text-red-600" : "text-gray-700"}`}>
        {label}
      </Text>
      <View
        className={`flex-row items-center bg-white/40 backdrop-blur rounded-xl px-4 border-2 ${
          error
            ? "border-red-400 bg-red-50/40"
            : isFocused
            ? "border-c4 bg-white/60"
            : "border-c3/50"
        }`}
      >
        <Ionicons
          name={icon}
          size={20}
          color={error ? "#dc2626" : isFocused ? "#C9B59C" : "#9ca3af"}
          style={{ marginRight: 12 }}
        />
        <TextInput
          className={`flex-1 py-4 text-base ${error ? "text-red-700" : "text-gray-900"}`}
          placeholder={placeholder}
          placeholderTextColor={error ? "#fca5a5" : "#9ca3af"}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize={keyboardType === "email-address" ? "none" : "words"}
        />
      </View>
      {error && (
        <View className="flex-row items-center mt-1.5 ml-1">
          <Ionicons name="alert-circle" size={12} color="#dc2626" />
          <Text className="text-red-600 text-xs ml-1 flex-1">{error}</Text>
        </View>
      )}
    </View>
  );
}
